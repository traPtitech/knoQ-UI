import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Rooms from '@/views/Room/Rooms.vue'
import Reservations from '@/views/Reservation/Reservations.vue'
import ReservationDescription from '@/views/Reservation/Description.vue'
import ReservationNew from '@/views/Reservation/New.vue'
import Groups from '@/views/Group/Groups.vue'
import GroupDescription from '@/views/Group/Description.vue'
import GroupEdit from '@/views/Group/Edit.vue'
import GroupsNew from '@/views/Group/New.vue'
import Search from '@/views/Search.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/rooms',
      name: 'Rooms',
      component: Rooms,
    },
    {
      path: '/reservaions',
      name: 'Reservations',
      component: Reservations,
    },
    {
      path: '/reservations/:id',
      name: 'ReservationDescription',
      component: ReservationDescription,
    },
    {
      path: '/reservaions/new',
      name: 'ReservationNew',
      component: ReservationNew,
    },
    {
      path: '/groups',
      name: 'Groups',
      component: Groups,
    },
    {
      path: '/groups/new',
      name: 'GroupNew',
      component: GroupsNew,
    },
    {
      path: '/groups/:id',
      name: 'GroupDescription',
      component: GroupDescription,
    },
    {
      path: '/groups/:id/edit',
      name: 'GroupEdit',
      component: GroupEdit,
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
    },
  ],
})
