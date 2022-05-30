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
        component: () => import(/* webpackChunkName: "about" */ '../views/Contacts.vue'),
        children: [
          {
            path: '',
            name: 'Contacts',
            component: () => import('../components/contactsPage/tismContacts/TismContacts'),
          },
          {
            path: 'google-contacts',
            name: 'GoogleContacts',
            component: () => import('../components/contactsPage/googleContacts/GoogleContacts'),
          },
          {
            path: 'outlook-contacts',
            name: 'OutlookContacts',
            component: () => import('../components/contactsPage/outlookContacts/OutlookContacts'),
          },
        ]
      },
      {
        path: 'profile',
        component: () => import('../views/Profile'),
        children: [
          {
            path: '',
            name: 'Profile',
            component: () => import('../components/profilePage/UserInfo'),
          },
          {
            path: 'edit',
            name: 'EditProfile',
            component: () => import('../components/profilePage/EditProfile'),
          },
        ]
      },
      {
        path: 'friends',
        component: () => import('../views/Friends'),
        children: [
          {
            path: '',
            name: 'ListFriends',
            component: () => import('../components/friendsPage/listFriends/ListFriends'),
          },
          {
            path: 'invitations',
            name: 'InvitationsFriends',
            component: () => import('../components/friendsPage/invitationsFriends/InvitationsFriends'),
          },
          {
            path: 'find',
            name: 'FindFriends',
            component: () => import('../components/friendsPage/findFriends/FindFriends'),
          },
        ]
      },
      {
        path: 'person',
        component: () => import('../views/PersonProfile'),
        children: [
          {
            path: ':personId/info',
            name: 'PersonInfo',
            component: () => import('../components/personPage/PersonInfo'),
          },
          {
            path: ':personId/mutual-friends',
            name: 'MutualFriends',
            component: () => import('../components/personPage/MutualFriends'),
          },
        ]
      },
      {
        path: 'chat',
        name: 'FriendChatDefault',
        component: () => import('../views/FriendChat')
      },
      {
        path: 'chat/:chatRoomId',
        name: 'FriendChat',
        component: () => import('../views/FriendChat')
      },
      // {
      //   path: 'home-test',
      //   name: 'HomeTest',
      //   component: () => import('../views/HomeTest')
      // }
      {
        path: '/team/:teamId',
        name: 'Team',
        props: true,
        component: () => import('../views/Team')
      },
      {
        path: 'teams',
        name: 'Teams',
        component: () => import('../views/Teams')
      },
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
  {
    path: '/*',
    name: 'Not Found',
    component: () => import('../views/NotFound')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
