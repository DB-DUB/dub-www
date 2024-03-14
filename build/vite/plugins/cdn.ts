// import { cdn } from 'vite-plugin-cdn2'
import { cdn } from '../../vite-plugin-cdn/src/index'

const cdnDomain = '/libs'

export const CdnPlugin = (isBuild: boolean) => {
  return cdn({
    isProduction: isBuild,
    modules: [
      {
        name: 'vue',
        global: 'Vue',
        spare: `${cdnDomain}/vue@3.4.15.min.js`
      },
      {
        name: 'vue-router',
        global: 'VueRouter',
        spare: `${cdnDomain}/vue-router@4.2.5.min.js`
      },
      // VueDemi is what pinia needs to determine whether it is vue2 or vue3
      {
        name: 'vue-demi',
        global: 'VueDemi',
        spare: `${cdnDomain}/vue-demi@0.14.6.min.js`
      },
      {
        name: 'pinia',
        global: 'Pinia',
        spare: `${cdnDomain}/pinia@2.1.7.min.js`
      },
      {
        name: 'axios',
        global: 'axios',
        spare: `${cdnDomain}/axios@1.6.7.min.js`
      }
    ],
    preset: false,
    transform(results) {
      results.forEach(result => {
        if (result.tag === 'script') {
          result.defer = true
        }
      })
    }
  })
}
