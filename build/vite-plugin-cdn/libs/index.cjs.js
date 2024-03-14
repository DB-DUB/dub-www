'use strict'

var happyDom = require('happy-dom')
var MagicString = require('magic-string')
var path = require('path')
var fs = require('fs')
var module$1 = require('module') // eslint-disable-next-line @typescript-eslint/ban-ts-comment

/**
 * Currently, i used ignored to disabled the warn in terminal. Because from the
 * ava document. i can't found any way to set different  tsconfig for it compiler.
 */ // @ts-ignored
const _require = module$1.createRequire(
  typeof document === 'undefined'
    ? new (require('u' + 'rl').URL)('file:' + __filename).href
    : (document.currentScript && document.currentScript.src) ||
        new URL('index.cjs.js', document.baseURI).href
)
const requireResolve = module => _require.resolve(module)
const tryRequireModule = module => {
  return _require(module)
}
const ERRORS = {
  INVALID_PACKAGE: 'INVALID_PACKAGE',
  NO_PRESET_FIELDS: 'NO_PRESET_FIELDS',
  INVALID_PRESET: 'INVALID_PRESET',
  ERR_PACKAGE_PATH_NOT_EXPORTED: 'ERR_PACKAGE_PATH_NOT_EXPORTED'
}
const error = native => {
  if (!(native instanceof Error)) native = Object.assign(new Error(native.message), native)
  throw native
}
const lookup = (entry, target) => {
  const dir = path.dirname(entry)
  const targetFile = path.join(dir, target)
  if (fs.existsSync(targetFile)) return targetFile
  return lookup(dir, target)
}
const tryRequireRealModule = module => {
  const str = fs.readFileSync(module, 'utf8')
  return JSON.parse(str)
}

// This file invorked by `cdn-impl`. Provide translate func
// only transform import and export syntax.
// ExportAllDeclaration is a special case. we should analyze it (May it'll cause bug. At present, All i can think of should be `default export`)
// Maybe it's also break the semantics of the original code.
// Just like vue3 don't export as default export. but using this plugin you can write `import Vue from 'vue';`
// Will be transform as `const __import__Vue = Vue;` (Currently, Don't care the module is a namespace.)
// In some case. mayn't be able to cover :) If the case is right. PR Welcome.
// FYI.
// Refer https://astexplorer.net/
const AST_TYPES = {
  IMPORT_DECLARATION: 'ImportDeclaration',
  EXPORT_NAMED_DECLARATION: 'ExportNamedDeclaration',
  EXPORT_ALL_DECLARATION: 'ExportAllDeclaration'
}
const ensureExportModule = (local, exported, globalName) => {
  if (local.name === exported.name) {
    if (local.name === 'default') return globalName
    return `${globalName}.${local.name}`
  }
  return `${globalName}.${local.name}`
}
// We will analyzed the import and export syntax in source code.
// Transform them by right rule.
const graph = async (nodes, finder) => {
  const weaks = new Map()
  const pows = new Map()
  const nodeInvork = (nodes, filter, invork) => {
    const filters = nodes.filter(({ type }) => filter.includes(type))
    filters.forEach(v => invork && invork(v))
  }
  nodeInvork(nodes, [AST_TYPES.IMPORT_DECLARATION], imports => {
    const { source, specifiers, start, end } = imports
    const { value } = source
    if (!value) return
    if (!finder.has(value)) return
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { global: alias } = finder.get(value)
    specifiers.length &&
      specifiers.forEach(spec => {
        const { imported, local } = spec
        const n = imported ? `${alias}.${imported.name}` : alias
        weaks.set(local.name, {
          alias: n,
          pos: [start, end]
        })
      })
    return
  })
  await nodeInvork(
    nodes,
    [AST_TYPES.EXPORT_NAMED_DECLARATION, AST_TYPES.EXPORT_ALL_DECLARATION],
    exports => {
      const { source, specifiers, start, end, declaration, type } = exports
      switch (type) {
        case AST_TYPES.EXPORT_ALL_DECLARATION: {
          const { value } = source
          if (!value) return
          if (!finder.has(value)) return
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const { global: alias } = finder.get(value)
          import(value).then(pkg => {
            const keys = Object.keys(pkg)
            const realKeys =
              keys.length === 1 && keys[0] === 'default' ? Object.keys(pkg.default) : keys
            realKeys.forEach(k => {
              pows.set(k === 'default' ? alias : k, {
                alias: `${alias}.${k}`,
                pos: [start, end],
                isDefault: k === 'default'
              })
            })
          })
          break
        }
        default:
          /**
           * In some case
           * ```js
           *  import Vue from 'vue'
           *  export const vue = Vue
           * ```
           * We will replace the import syntax so we should skip the export syntax with declaration
           *
           * Second Case
           *
           * ```js
           *  import { ref } from 'vue'
           *  export { ref }
           * ```
           * Accroding AST node. this case source will be null. should be skip
           *
           */ if (declaration || !source) return
          const { value: value1 } = source
          if (!value1) return
          if (!finder.has(value1)) return
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const { global: alias1 } = finder.get(value1)
          specifiers &&
            specifiers.forEach(spec => {
              const { exported, local } = spec
              // named export can cover a variety of situations.
              // ReExport :)
              const n = ensureExportModule(local, exported, alias1)
              const isDefault = exported.name === 'default'
              pows.set(local.name === 'default' ? alias1 : isDefault ? local.name : exported.name, {
                alias: n,
                pos: [start, end],
                isDefault
              })
            })
      }
      return
    }
  )
  return {
    weaks,
    pows
  }
}
const translate = async (nodes, { finder, code }) => {
  const { weaks, pows } = await graph(nodes.body, finder)
  const s = []
  const es = []
  /**
   * eg:
   *  import Vue from 'vue'
   *  transform as const _Vue = Vue
   */ weaks.forEach(({ pos, alias }, k) => {
    const ident = k === alias ? `__import__${k}` : k
    s.push(`const ${ident} = ${alias};\n`)
    code.remove(pos[0], pos[1])
  })
  /**
   * eg:
   *  export { ref } from  'vue'
   *  transform as export const ref =  Vue.ref
   *
   *  export { ref as default } from 'vue'
   *  transform as const  ref = Vue.ref
   *                export default ref
   *
   *  export {default as React } from 'react'
   *  transform as export const _React  = React
   *
   *  export * from 'vue'
   *  transform as export const ref = Vue.ref
   */ pows.forEach(({ pos, alias, isDefault }, k) => {
    const ident = k === alias ? `__export__${k}` : k
    const str = isDefault
      ? `const ${ident} = ${alias};\nexport default ${ident};\n`
      : `export const ${ident} = ${alias};\n`
    es.push(str)
    code.remove(pos[0], pos[1])
  })
  code.appendLeft(
    0,
    s.reduce((acc, cur) => (acc += cur), '')
  )
  code.append(es.reduce((acc, cur) => (acc += cur), ''))
  return {
    code
  }
}

// Unfortunately. I'm ava noob. `vite-cdn-plugin-2` is a pure esm
// library. I can't find any way to define different `tsconfig`
// for ava.
// So as a temporary solution. compose part should be independent.
// refer: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {}
  var target = _objectWithoutPropertiesLoose(source, excluded)
  var key, i
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source)
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i]
      if (excluded.indexOf(key) >= 0) continue
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue
      target[key] = source[key]
    }
  }
  return target
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {}
  var target = {}
  var sourceKeys = Object.keys(source)
  var key, i
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i]
    if (excluded.indexOf(key) >= 0) continue
    target[key] = source[key]
  }
  return target
}
const unique = original => Array.from(new Set(original))
class ParserModuleStruct {
  toString() {
    return this.modules.reduce((acc, cur) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { url, tag, name: _ } = cur,
        rest = _objectWithoutProperties(cur, ['url', 'tag', 'name'])
      const parameter = Object.entries(rest).reduce((acc, [attr, v]) => {
        if (v) {
          if (typeof v === 'boolean') return (acc += `${attr.toLowerCase()} `)
          return (acc += `${attr.toLowerCase()}="${v}" `)
        }
        return acc
      }, '')
      const str =
        tag === 'link'
          ? `<link ${parameter} href="${url}" />`
          : `<script ${parameter} src="${url}"></script>`
      return (acc += str + '\n')
    }, '')
  }
  get modules() {
    if (this._modules) return this._modules
    return this.format()
  }
  set modules(values) {
    this._modules = values
  }
  format() {
    const spares = Array.from(this.input.values()).reduce((acc, { spare, name }) => {
      if (Array.isArray(spare)) {
        unique(spare).forEach(s =>
          acc.push({
            name,
            spare: s
          })
        )
        return acc
      }
      acc.push({
        name,
        spare
      })
      return acc
    }, [])
    return spares.reduce((acc, { name, spare }) => {
      const meta = {
        tag: spare.split('.').pop() === 'js' ? 'script' : 'link',
        url: spare,
        name
      }
      if (meta.tag === 'link') meta.rel = 'stylesheet'
      acc.push(meta)
      return acc
    }, [])
  }
  constructor(userModules) {
    this.input = userModules
  }
}

const PRESET_CDN_DOMAIN = {
  jsdelivr: 'https://cdn.jsdelivr.net/npm/',
  unpkg: 'https://unpkg.com/'
}
const parserModuleImpl = (modules, preset) => {
  const bucket = []
  const finder = new Map()
  const monitor = (type, { jsdelivr, unpkg, version, name }, throwError) => {
    const ensureResource =
      type === 'jsdelivr'
        ? jsdelivr
        : type === 'unpkg'
        ? unpkg
        : type === 'auto'
        ? jsdelivr || unpkg
        : undefined
    if (!ensureResource) {
      if (!throwError) {
        return ERRORS.NO_PRESET_FIELDS
      }
      error({
        code: ERRORS.NO_PRESET_FIELDS,
        message: ''
      })
    }
    const autoType = jsdelivr ? 'jsdelivr' : 'unpkg'
    return `${
      PRESET_CDN_DOMAIN[type === 'auto' ? autoType : type]
    }${name}@${version}/${ensureResource}`
  }
  modules.forEach((module, i) => {
    const { name, global, spare } = module
    if (!name || !global) {
      if (!name)
        throw Error(`[vite-plugin-cdn2]: Please pass the name for modules at postion ${i}. `)
      throw Error(`[vite-plugin-cdn2]: Please pass the global for modules at postion ${i}. `)
    }
    if (typeof preset === 'boolean' && !preset) {
      if (!spare || !spare.length) {
        bucket.push(name)
        return
      }
      finder.set(name, {
        name,
        global,
        spare
      })
      return
    }
    try {
      const { version, unpkg, jsdelivr } = tryRequireModule(`${name}/package.json`)
      switch (preset) {
        case 'auto':
        case 'unpkg':
        case 'jsdelivr':
          const track = {
            name,
            global,
            spare: [
              monitor(
                preset,
                {
                  jsdelivr,
                  unpkg,
                  version,
                  name
                },
                true
              )
            ]
          }
          if (spare === null || spare === void 0 ? void 0 : spare.length) {
            const latestSpare = Array.isArray(spare) ? spare : [spare]
            track.spare.push(...latestSpare)
          }
          finder.set(name, track)
          break
        default:
          error({
            code: ERRORS.INVALID_PRESET,
            message: `[vite-plugin-cdn2]: Invalid preset ${preset}`
          })
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err) {
      // https://www.typescriptlang.org/tsconfig#useUnknownInCatchVariables
      if (err.code) {
        switch (err.code) {
          case ERRORS.INVALID_PACKAGE:
            error(err)
          case ERRORS.NO_PRESET_FIELDS:
            if (!(spare === null || spare === void 0 ? void 0 : spare.length))
              return bucket.push({
                name,
                type: ERRORS.NO_PRESET_FIELDS
              })
            return finder.set(name, {
              name,
              global,
              spare
            })
          // In some libraries who set type=module will trigger this logic.
          case ERRORS.ERR_PACKAGE_PATH_NOT_EXPORTED:
            const modulePath = requireResolve(name)
            const { version: version1, jsdelivr: jsdelivr1, unpkg: unpkg1 } = tryRequireRealModule(
              lookup(modulePath, 'package.json')
            )
            const link = monitor(preset, {
              jsdelivr: jsdelivr1,
              unpkg: unpkg1,
              version: version1,
              name
            })
            if (link === ERRORS.NO_PRESET_FIELDS)
              return bucket.push({
                name,
                type: ERRORS.NO_PRESET_FIELDS
              })
            const track1 = {
              name,
              global,
              spare: [link]
            }
            if (spare === null || spare === void 0 ? void 0 : spare.length) {
              const latestSpare1 = Array.isArray(spare) ? spare : [spare]
              track1.spare.push(...latestSpare1)
            }
            finder.set(name, track1)
        }
        return
      }
      bucket.push({
        name,
        type: 'INVALID_PACKAGE'
      })
    }
  })
  return {
    finder,
    bucket
  }
}
const cdn = (options = {}) => {
  const { modules = [], isProduction = false, preset = 'auto', logInfo = 'info' } = options
  const { finder, bucket } = parserModuleImpl(modules, preset)
  if (bucket.length && logInfo === 'info') {
    bucket.forEach(b => {
      // If disabled the preset conf.
      if (typeof b === 'string') {
        console.warn(`[vite-plugin-cdn2]: please enter manually for ${b}.`)
        return
      }
      const { type, name } = b
      switch (type) {
        case 'INVALID_PACKAGE':
          console.warn(
            `[vite-plugin-cdn2]: can't find ${name} from node_modules in the workspace. Please check the package name manually.`
          )
          break
        case 'NO_PRESET_FIELDS':
          console.warn(
            `[vite-plugin-cdn2]: can't find unpkg or jsdelivr filed from ${name}. Please enter manually.`
          )
          break
      }
    })
  }
  return {
    name: 'vite-plugin-cdn',
    enforce: 'post',
    async transform(code, id) {
      if (!isProduction) return
      if (id[0] === '\0') return
      if ([...finder.keys()].every(s => !code.includes(s))) return
      const ast = this.parse(code)
      const { code: parserd } = await translate(ast, {
        finder,
        code: new MagicString(code)
      })
      return {
        code: parserd.toString(),
        map: parserd.generateMap()
      }
    },
    transformIndexHtml(raw) {
      if (!isProduction) return
      const struct = new ParserModuleStruct(finder)
      let { modules } = struct
      if (options.transform) {
        const res = options.transform(modules)
        if (res) modules = res
      }
      struct.modules = modules
      const tpl = struct.toString()
      const window = new happyDom.Window()
      const { document } = window
      document.body.innerHTML = raw
      const titleEl = document.body.querySelector('title')
      titleEl.insertAdjacentHTML('beforebegin', tpl)
      return document.body.innerHTML
    }
  }
}
cdn.version = '0.3.3'

exports.cdn = cdn
