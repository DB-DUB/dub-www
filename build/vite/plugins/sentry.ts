import { sentryVitePlugin } from '@sentry/vite-plugin'

export const SentryPlugin = envObj => {
  return sentryVitePlugin({
    release: envObj.name + '@' + envObj.version,
    include: './dist/static/js/',
    ignore: ['node_modules', 'vite.config.ts'],
    urlPrefix: '~/static/js/',
    ext: ['map'],
    telemetry: false
  })
}
