import path from 'path'
import fs from 'fs'
import { createRequire } from 'module'
import type { InternalError } from './interface'

/**
 * Currently, i used ignored to disabled the warn in terminal. Because from the
 * ava document. i can't found any way to set different  tsconfig for it compiler.
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignored
const _require = createRequire(import.meta.url)

export const requireResolve = (module: string): string => _require.resolve(module)

export const tryRequireModule = <T>(module: string): T => {
  return _require(module) as T
}

export const ERRORS = {
  INVALID_PACKAGE: 'INVALID_PACKAGE',
  NO_PRESET_FIELDS: 'NO_PRESET_FIELDS',
  INVALID_PRESET: 'INVALID_PRESET',
  ERR_PACKAGE_PATH_NOT_EXPORTED: 'ERR_PACKAGE_PATH_NOT_EXPORTED'
} as const

export const error = (native: Error | InternalError) => {
  if (!(native instanceof Error)) native = Object.assign(new Error(native.message), native)
  throw native
}

export const lookup = (entry: string, target: string): string => {
  const dir = path.dirname(entry)
  const targetFile = path.join(dir, target)
  if (fs.existsSync(targetFile)) return targetFile
  return lookup(dir, target)
}

export const tryRequireRealModule = <T>(module: string): T => {
  const str = fs.readFileSync(module, 'utf8')
  return JSON.parse(str)
}
