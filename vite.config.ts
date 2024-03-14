import { fileURLToPath, URL } from 'node:url'
import { loadEnv } from 'vite'
import { wrapperEnv } from './build/utils'

import type { UserConfig, ConfigEnv } from 'vite'

import { createVitePlugins } from './build/vite/plugins'
import { VITE_PORT } from './build/constant'
// import proxy from './build/vite/proxy'
import { createProxy } from './build/vite/proxy'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import nodePolyfills from 'rollup-plugin-node-polyfills'

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd())
  // The boolean type read by loadEnv is a string. This function can be converted to boolean type
  const viteEnv = wrapperEnv(env)

  const isBuild = command === 'build'
  const isProd = mode === 'production'

  return {
    base: '/',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        stream: 'rollup-plugin-node-polyfills/polyfills/stream',
        events: 'rollup-plugin-node-polyfills/polyfills/events',
        assert: 'assert',
        crypto: 'crypto-browserify',
        util: 'util',
        'near-api-js': 'near-api-js/dist/near-api-js.js',
        process: 'rollup-plugin-node-polyfills/polyfills/process-es6'
      }
    },
    define: {
      'process.env': process.env ?? {}
    },
    server: {
      hmr: { overlay: false },
      port: VITE_PORT,
      open: true,
      cors: false,
      host: true,
      proxy: createProxy()
    },
    plugins: createVitePlugins(isBuild, isProd, viteEnv),
    esbuild: {
      drop: isProd ? ['console', 'debugger'] : []
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      sourcemap: isProd,
      outDir: 'dist',
      rollupOptions: {
        plugins: [nodePolyfills({ crypto: true }) as any],
        output: {
          // static files
          chunkFileNames: 'static/js/[name].[hash].js',
          entryFileNames: 'static/js/[name].[hash].js',
          assetFileNames: 'static/[ext]/[name].[hash].[ext]',
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          }
        }
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {}
        }
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        plugins: [NodeGlobalsPolyfillPlugin({ buffer: true }) as any]
      }
    }
  }
}
