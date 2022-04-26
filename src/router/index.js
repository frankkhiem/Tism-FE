import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register')
  },
  {
    path: '/',
    component: () => import('../components/layouts/MainLayout'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home'),
      },
      {
        path: 'about',
        name: 'About',
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
      },
      {
        path: 'contacts',
        name: 'Contacts',
        component: () => import(/* webpackChunkName: "about" */ '../views/Contacts.vue')
      },
      // {
      //   path: 'profile',
      //   name: 'Profile',
      //   component: () => import('../views/Profile')
      // },
      // {
      //   path: 'home-test',
      //   name: 'HomeTest',
      //   component: () => import('../views/HomeTest')
      // }
    ]
  },
  {
    path: '/outlook/get-auth-code',
    name: 'Outlook Code',
    component: () => import('../views/OutlookCode')
  },
  {
    path: '/google/get-auth-code',
    name: 'Google Code',
    component: () => import('../views/GoogleCode')
  },
  // {
  //   path: '/zalo/get-auth-code',
  //   name: 'Zalo Code',
  //   component: () => import('../views/ZaloCode')
  // },
  // {
  //   path: '/*',
  //   name: 'Not Found',
  //   component: () => import('../views/NotFoundPage')
  // },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router