/**
 * @name createVitePlugins
 * @description for Vite plugins
 */
import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'

import { AutoRegistryComponents } from './component'
import { ConfigMockPlugin } from './mock'
import { CdnPlugin } from './cdn'
import { InjectVconsolePlugin } from './vconsole'
import { ConfigCompressPlugin } from './compress'
import { SentryPlugin } from './sentry'
import { VITE_USE_MOCK } from '../../constant'

export function createVitePlugins(isBuild: boolean, isProd: boolean, envObj) {
  const vitePlugins: (PluginOption | PluginOption[])[] = [
    // Support Vue
    vue()
  ]

  const { VITE_APP_NAME, VITE_APP_VERSION } = envObj

  // Auto Registry Components
  vitePlugins.push(AutoRegistryComponents())

  vitePlugins.push(CdnPlugin(isBuild))

  // Auto Inject Vconsole for debug in development environment
  // vitePlugins.push(InjectVconsolePlugin({ isProd, isBuild }))

  // Enable .gz compression  rollup-plugin-gzip
  vitePlugins.push(ConfigCompressPlugin())

  // vite-plugin-mock
  VITE_USE_MOCK && vitePlugins.push(ConfigMockPlugin(isBuild))

  isProd && vitePlugins.push(SentryPlugin({ name: VITE_APP_NAME, version: VITE_APP_VERSION }))

  return vitePlugins
}
