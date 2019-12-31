import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home.vue'
import Rooms from '@/pages/Room/Rooms.vue'
import Reservations from '@/pages/Reservation/Reservations.vue'
import ReservationDescription from '@/pages/Reservation/Description.vue'
import ReservationNew from '@/pages/Reservation/New.vue'
import Groups from '@/pages/Group/Groups.vue'
import GroupDescription from '@/pages/Group/Description.vue'
import GroupEdit from '@/pages/Group/Edit.vue'
import GroupsNew from '@/pages/Group/New.vue'
import Search from '@/pages/Search.vue'
import EventDetail from '@/pages/Event/Detail.vue'

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
    {
      path: '/events/:id',
      name: 'EventDetail',
      component: EventDetail,
    },
  ],
})
