import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Rooms from './views/Room/Rooms'
import Reservations from './views/Reservation/Reservations'
import ReservationDescription from './views/Reservation/Description'
import ReservationNew from './views/Reservation/New'
import Groups from './views/Group/Groups'
import GroupDescription from './views/Group/Description'
import GroupEdit from './views/Group/Edit'
import GroupsNew from './views/Group/New'
import Search from './views/Search'

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
