import { createRouter, createWebHistory } from 'vue-router'

import type { RouteRecordRaw } from 'vue-router'

const WHITE_NAME_LIST: string[] = ['Login']

const routerReleased = import.meta.env.VITE_FLAG_OTHER_RELEASE

export const defaultRoutes: Array<RouteRecordRaw> =
  routerReleased === 'true'
    ? [
        {
          path: '/',
          name: 'Index',
          component: () => import('@/views/index/index.vue')
        },
        {
          path: '/login',
          name: 'Login',
          component: () => import('@/views/login/index.vue'),
          meta: { hidden: true, showMenu: true, activeMenu: 'Prank' }
        },
        {
          path: '/:path(.*)*',
          component: () => import('@/views/404.vue')
        }
      ]
    : [
        {
          path: '/',
          name: 'Index',
          component: () => import('@/views/index/index.vue')
        },
        {
          path: '/:path(.*)*',
          component: () => import('@/views/404.vue')
        }
      ]

const getRouteNames = (array: any[]) =>
  array.forEach(item => {
    if (item.name) WHITE_NAME_LIST.push(item.name)
    getRouteNames(item.children || [])
  })
getRouteNames(defaultRoutes)

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: defaultRoutes,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0, y: 0 })
})

// reset router
export function resetRouter() {
  router.getRoutes().forEach(route => {
    const { name } = route
    if (name && !WHITE_NAME_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export default router
