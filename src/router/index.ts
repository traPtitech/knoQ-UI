import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import Events from '@/pages/Event/Events.vue'
import EventDetail from '@/pages/Event/Detail.vue'
import EventNew from '@/pages/Event/New.vue'
import GroupsNew from '@/pages/Group/New.vue'
import NotFound from '@/pages/NotFound.vue'
import WIP from '@/pages/WIP.vue'
import PathStorage from '@/utils/PathStorage'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: WIP,
      meta: { headerTitle: 'Dashboard' },
    },
    {
      path: '/rooms',
      name: 'Rooms',
      component: WIP,
      meta: { headerTitle: 'Rooms' },
    },
    {
      path: '/groups',
      name: 'Groups',
      component: WIP,
      meta: { headerTitle: 'Groups' },
    },
    {
      path: '/groups/new',
      name: 'GroupNew',
      component: GroupsNew,
      meta: { headerTitle: 'Create new group' },
    },
    {
      path: '/groups/:id',
      name: 'GroupDescription',
      component: WIP,
      meta: { headerTitle: 'Group detail' },
    },
    {
      path: '/groups/:id/edit',
      name: 'GroupEdit',
      component: WIP,
      meta: { headerTitle: 'Edit group detail' },
    },
    {
      path: '/events',
      name: 'Events',
      component: Events,
      meta: { headerTitle: 'Events' },
    },
    {
      path: '/events/new',
      name: 'EventNew',
      component: EventNew,
      meta: { headerTitle: 'Create new event' },
    },
    {
      path: '/events/:id',
      name: 'EventDetail',
      component: EventDetail,
      meta: { headerTitle: 'Event detail' },
    },
    {
      path: '/callback',
      name: 'Callback',
      redirect: PathStorage.getSavedPath() || '/',
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound,
      meta: { headerTitle: '' },
    },
  ],
})

router.beforeEach(async (_to, _from, next) => {
  if (!store.state.me) {
    store.dispatch.getMe()
  }
  next()
})

export default router
