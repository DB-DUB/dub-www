import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { setupStore } from '@/stores'
import SentryReport from '@/utils/sentry'

import '@/permission'
import '@/styles/index.less'

const app = createApp(App)

app.use(router)

setupStore(app)

const sentry = new SentryReport()
sentry.install(app)

app.mount('#app')
