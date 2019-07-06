import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Rooms from './views/Rooms.vue'
import Reservations from './views/Reservations'
import ReservationDescription from './views/ReservationDescription'
import ReservationNew from './views/ReservationNew'
import Groups from './views/Groups'
import GroupDescription from './views/GroupDescription'
import GroupEdit from './views/GroupEdit'
import GroupsNew from './views/GroupNew'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/rooms',
      name: 'Rooms',
      component: Rooms
    },
    {
      path: '/reservaions',
      name: 'Reservations',
      component: Reservations
    },
    {
      path: '/reservations/:id',
      name: 'ReservationDescription',
      component: ReservationDescription
    },
    {
      path: '/reservaions/new',
      name: 'ReservationNew',
      component: ReservationNew
    },
    {
      path: '/groups',
      name: 'Groups',
      component: Groups
    },
    {
      path: '/groups/new',
      name: 'GroupNew',
      component: GroupsNew
    },
    {
      path: '/groups/:id',
      name: 'GroupDescription',
      component: GroupDescription
    },
    {
      path: '/groups/:id/edit',
      name: 'GroupEdit',
      component: GroupEdit
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
