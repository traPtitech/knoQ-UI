import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import Rooms from '@/pages/Room/Rooms'
import Reservations from '@/pages/Reservation/Reservations'
import ReservationDescription from '@/pages/Reservation/Description'
import ReservationNew from '@/pages/Reservation/New'
import Groups from '@/pages/Group/Groups'
import GroupDescription from '@/pages/Group/Description'
import GroupEdit from '@/pages/Group/Edit'
import GroupsNew from '@/pages/Group/New'
import Search from '@/pages/Search'

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
      path: '/search',
      name: 'Search',
      component: Search
    }
  ]
})
