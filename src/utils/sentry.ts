import * as Sentry from '@sentry/vue'
import type { App } from 'vue'

class SentryReport {
  public sentry = Sentry
  private dsn = import.meta.env.VITE_SENTRY_DSN
  private whiteDomains: string[] = []

  install(app: App<Element>) {
    if (!this.isCanInstall() || !app) return

    this.init(app)
    app.config.globalProperties.$sentry = this.sentry
  }

  // Determine whether the current environment is in the whitelist
  isCanInstall() {
    const host = window.location.host
    return this.whiteDomains.includes(host)
  }

  init(app) {
    this.sentry.init({
      app,
      dsn: this.dsn,
      integrations: [new Sentry.BrowserTracing({})],
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      // tracesSampleRate: 1.0,
      tracesSampleRate: 0,
      release: import.meta.env.VITE_APP_NAME + '@' + import.meta.env.VITE_APP_VERSION,
      environment: import.meta.env.MODE,
      ignoreErrors: [
        'Failed to fetch dynamically imported module',
        /Failed to (load|fetch) dynamically imported module/
      ]
    })
  }

  captureException(err) {
    this.sentry.captureException(err)
  }
}

export default SentryReport
