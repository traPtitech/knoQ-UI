import Vue from 'vue'
import Router from 'vue-router'
import Events from '@/pages/Event/Events.vue'
import EventDetail from '@/pages/Event/Detail.vue'
import EventNew from '@/pages/Event/New.vue'
import GroupsNew from '@/pages/Group/New.vue'
import NotFound from '@/pages/NotFound.vue'
import WIP from '@/pages/WIP.vue'
import PathStorage from '@/utils/PathStorage'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: WIP,
    },
    {
      path: '/rooms',
      name: 'Rooms',
      component: WIP,
    },
    {
      path: '/groups',
      name: 'Groups',
      component: WIP,
    },
    {
      path: '/groups/new',
      name: 'GroupNew',
      component: GroupsNew,
    },
    {
      path: '/groups/:id',
      name: 'GroupDescription',
      component: WIP,
    },
    {
      path: '/groups/:id/edit',
      name: 'GroupEdit',
      component: WIP,
    },
    {
      path: '/events',
      name: 'Events',
      component: Events,
    },
    {
      path: '/events/new',
      name: 'EventNew',
      component: EventNew,
    },
    {
      path: '/events/:id',
      name: 'EventDetail',
      component: EventDetail,
    },
    {
      path: '/callback',
      name: 'Callback',
      beforeEnter: (to, from, next) => next(PathStorage.getSavedPath() || '/'),
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound,
    },
  ],
})
