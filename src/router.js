import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Reservation from './views/Reservations'
import ReservationNew from './views/ReservationNew'
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
      path: '/reservaions',
      name: 'Reservation',
      component: Reservation
    },
    {
      path: '/reservaions/new',
      name: 'ReservationNew',
      component: ReservationNew
    },
    {
      path: '/groups/new',
      name: 'GroupNew',
      component: GroupsNew
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
