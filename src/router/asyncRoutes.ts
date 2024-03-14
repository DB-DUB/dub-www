import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/views/layout/index.vue'
import { shallowRef } from 'vue'

// name should be unique
const asyncRoutes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   redirect: '/prank',
  //   name: 'Welcome',
  //   meta: {
  //     hidden: true
  //   }
  // },
  {
    path: '/prank',
    component: shallowRef(Layout),
    name: 'Prank',
    meta: {
      mainMenu: true,
      showMenu: true,
      menuName: 'Prank',
      keepAlive: true
    },
    children: [
      {
        path: '',
        name: 'PrankMain',
        component: () => import('@/views/prank/index.vue'),
        meta: { showMenu: true, activeMenu: 'Prank', keepAlive: true }
      },
      {
        path: 'answer_detail',
        name: 'PrankAnswerDetail',
        component: () => import('@/views/prank/AnswerDetail.vue'),
        meta: { showMenu: false, activeMenu: 'Prank' }
      },
      {
        path: 'answer',
        name: 'PrankAnswers',
        component: () => import('@/views/prank/Answers.vue'),
        meta: { showMenu: true, activeMenu: 'Prank' }
      },
      {
        path: 'eqpts',
        name: 'PrankEqpts',
        component: () => import('@/views/prank/Eqpts.vue'),
        meta: { showMenu: true, activeMenu: 'Prank' }
      }
    ]
  },
  {
    path: '/my_eggs',
    component: shallowRef(Layout),
    name: 'MyEggs',
    meta: {
      mainMenu: true,
      showMenu: true,
      menuName: 'My Eggs',
      keepAlive: true
    },
    children: [
      {
        path: '',
        name: 'MyEggsList',
        component: () => import('@/views/equipment/index.vue'),
        meta: { showMenu: true, activeMenu: 'MyEggs', keepAlive: true }
      }
    ]
  },
  {
    path: '/shop',
    component: shallowRef(Layout),
    name: 'Shop',
    meta: {
      mainMenu: true,
      showMenu: true,
      menuName: 'Shop',
      keepAlive: true
    },
    children: [
      {
        path: '',
        name: 'ShopMain',
        component: () => import('@/views/shop/index.vue'),
        meta: { showMenu: true, activeMenu: 'Shop', keepAlive: true }
      }
    ]
  },
  {
    path: '/:path(.*)*',
    redirect: '/404',
    meta: { hidden: true }
  }
]

export default asyncRoutes
