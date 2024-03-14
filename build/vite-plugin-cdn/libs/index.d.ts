import { Plugin } from 'vite'

interface TrackModule {
  name: string
  global: string
  spare?: Array<string> | string
}
type PresetDomain = 'auto' | 'jsdelivr' | 'unpkg' | false
type Transformed = Array<
  | (ScriptAttributes &
      Omit<Serialization, 'tag' | 'type'> & {
        tag: 'script'
      })
  | (LinkAttrobites &
      Omit<Serialization, 'tag' | 'type'> & {
        tag: 'link'
      })
>
interface CDNPluginOptions {
  isProduction?: boolean
  modules?: Array<TrackModule>
  preset?: PresetDomain
  logInfo?: 'silent' | 'info'
  transform?: (meta: Transformed) => void | Transformed
}
type ScriptAttributes = Partial<
  Pick<
    HTMLScriptElement,
    | 'async'
    | 'crossOrigin'
    | 'defer'
    | 'integrity'
    | 'noModule'
    | 'nonce'
    | 'referrerPolicy'
    | 'type'
  >
>
type LinkAttrobites = Partial<
  Pick<
    HTMLLinkElement,
    | 'as'
    | 'crossOrigin'
    | 'href'
    | 'hreflang'
    | 'imageSizes'
    | 'imageSrcset'
    | 'integrity'
    | 'media'
    | 'referrerPolicy'
    | 'rel'
    | 'title'
    | 'type'
  >
>
interface Serialization {
  url?: string
  type?: string
  name: string
  tag: 'link' | 'script'
}

declare const cdn: {
  (options?: CDNPluginOptions): Plugin
  version: string
}

export { PresetDomain, TrackModule, Transformed, cdn }
