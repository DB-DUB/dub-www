import { defineStore } from 'pinia'
import store from '@/stores'
import { defaultRoutes } from '@/router'
import asyncRoutes from '@/router/asyncRoutes'

import type { RouteRecordRaw } from 'vue-router'

/**
 * Determine whether it matches the current user permissions through meta.role
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

// Recursively check route permissions
function filterAsyncRouter(routes: Array<RouteRecordRaw>, roles) {
  const res: Array<RouteRecordRaw> = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
        if (!tmp.redirect && tmp.children.length > 0) {
          // tmp.redirect = tmp.path + '/' + tmp.children[0].path
          tmp.redirect = {
            name: tmp.children[0].name
          }
        }
      }
      res.push(tmp)
    }
  })
  return res
}

interface PermissionState {
  routers: RouteRecordRaw[]
  addRouters: RouteRecordRaw[]
}

export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => {
    return {
      routers: defaultRoutes,
      addRouters: []
    }
  },
  actions: {
    setRoutes(routes) {
      this.addRouters = routes
      this.routers = defaultRoutes.concat(routes)
    },
    generateRoutes(roles) {
      return new Promise(resolve => {
        const accessedRouters = filterAsyncRouter(asyncRoutes, roles)

        this.setRoutes(accessedRouters)

        resolve(true)
      })
    }
  }
})

// Need to be used outside the setup
export function usePermissionStoreWithOut() {
  return usePermissionStore(store)
}
