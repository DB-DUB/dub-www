import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import router, { resetRouter } from './router'
import { useUserStoreWithOut } from '@/stores/modules/user'
import { usePermissionStoreWithOut } from '@/stores/modules/permission'

import { getToken } from '@/utils/auth'
import { initServiceWorker } from '@/utils/register-service.worker'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useEqptStore } from './stores/modules/eqpt'
import { getPrankList } from './api/question'
import { usePrankStore } from './stores/modules/prank'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const routerReleased = import.meta.env.VITE_FLAG_OTHER_RELEASE === 'true'
const whiteList: RouteLocationNormalized['name'][] = routerReleased ? ['Login', 'Index'] : ['Index']
const defaultRoutePath = '/prank'
const loginPath = '/login'
const indexPath = '/'

router.beforeEach(async (to: RouteLocationNormalized, from, next: NavigationGuardNext) => {
  if (routerReleased) {
    console.log('to permission', to, from)
    const userStore = useUserStoreWithOut()

    // Start progress bar
    NProgress.start()

    const token = getToken()
    const tmpToken = String(to.query?.d || '')

    if (tmpToken) {
      await tmpToken2Token(to, next, tmpToken)
    }
    if (token) {
      /* has token */
      if (to.path === loginPath) {
        next({ path: defaultRoutePath })
        NProgress.done()
      } else {
        if (!userStore.roles || !userStore.roles.length) {
          // refresh the webpage
          await getUserInfo(to, next)
          // generate dynamic router by user permission roles
          await updateRouter()
          const redirect = decodeURIComponent((from.query.redirect || to.path) as string)
          const newQuery = { ...to.query }
          delete newQuery.d
          to.path === redirect
            ? next({ ...to, query: newQuery, replace: true })
            : next({ path: redirect })
        } else {
          next()
          NProgress.done()
        }
      }
    } else {
      if (whiteList.includes(to.name)) {
        next()
        NProgress.done()
      } else {
        next({ path: loginPath, query: { redirect: to.fullPath } })
        NProgress.done()
      }
    }
  } else {
    NProgress.start()
    next()
    NProgress.done()
  }
  
  const rootNode = document.body.parentNode
  if (to.path === indexPath) {
    rootNode.classList.add('index')
  } else {
    rootNode.classList.remove('index')
  }
})

const getUserInfo = async (to: RouteLocationNormalized, next: any) => {
  const userStore = useUserStoreWithOut()
  try {
    await userStore.getUserInfo()
    useEqptStore().sync2()
    // Obtain unclaimed Dub
    const response = await getPrankList(0, 1)
    if (response && response?.total_unclaimed) {
      usePrankStore().setClaimed(response?.total_unclaimed)
    }
    initServiceWorker()
  } catch (error) {
    await userStore.logout()
    next(`${loginPath}?redirect=${to.path}`)
  }
}

const tmpToken2Token = async (to: RouteLocationNormalized, next: any, tmpToken: string) => {
  const userStore = useUserStoreWithOut()
  try {
    await userStore.tmpTokenLogin(tmpToken)
  } catch (error) {}
}

const updateRouter = async () => {
  const userStore = useUserStoreWithOut()
  const permissionStore = usePermissionStoreWithOut()
  await permissionStore.generateRoutes(userStore.roles)
  resetRouter()
  permissionStore.addRouters.forEach(route => {
    router.addRoute(route)
  })
}
