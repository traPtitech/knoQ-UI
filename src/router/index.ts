import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import PathStorage from '@/workers/PathStorage'

const Dashboard = () => import('@/pages/Dashboard.vue')
const Calendar = () => import('@/pages/Calendar.vue')
const EventSearch = () => import('@/pages/EventSearch.vue')
const EventDetail = () => import('@/pages/EventDetail.vue')
const EventNew = () => import('@/pages/EventNew.vue')
const EventEdit = () => import('@/pages/EventEdit.vue')
const Workspace = () => import('@/pages/VerifiedRoom.vue')
const GroupDetail = () => import('@/pages/GroupDetail.vue')
const GroupNew = () => import('@/pages/GroupNew.vue')
const GroupEdit = () => import('@/pages/GroupEdit.vue')
const SettingIcal = () => import('@/pages/SettingIcal.vue')
const NotFound = () => import('@/pages/NotFound.vue')
const WIP = () => import('@/pages/WIP.vue')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      meta: { headerTitle: 'Dashboard' },
    },
    {
      path: '/rooms',
      name: 'Rooms',
      component: WIP,
      meta: { headerTitle: 'Rooms' },
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: Calendar,
      meta: { headerTitle: 'Calendar' },
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
      component: GroupNew,
      meta: { headerTitle: 'Create new group' },
    },
    {
      path: '/groups/:id',
      name: 'GroupDescription',
      component: GroupDetail,
      meta: { headerTitle: 'Group detail' },
    },
    {
      path: '/groups/edit/:id',
      name: 'GroupEdit',
      component: GroupEdit,
      meta: { headerTitle: 'Edit/Delete group' },
    },
    {
      path: '/events',
      name: 'Events',
      component: EventSearch,
      meta: { headerTitle: 'Events' },
    },
    {
      path: '/events/new',
      name: 'EventNew',
      component: EventNew,
      meta: { headerTitle: 'Create new event' },
    },
    {
      path: '/events/edit/:id',
      name: 'EventEdit',
      component: EventEdit,
      meta: { headerTitle: 'Edit/Delete event' },
    },
    {
      path: '/events/:id',
      name: 'EventDetail',
      component: EventDetail,
      meta: { headerTitle: 'Event detail' },
    },
    {
      path: '/workspace',
      name: 'Workspace',
      component: Workspace,
      meta: { headerTitle: 'Workspace' },
    },
    {
      path: '/callback',
      name: 'Callback',
      redirect: PathStorage.getSavedPath() || '/',
    },
    {
      path: '/settings/ical',
      name: 'Ical',
      component: SettingIcal,
      meta: { headerTitle: 'カレンダー配信設定' },
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
    await store.dispatch.getMe()
  }
  if (!store.state.usersCache.users) {
    store.dispatch.usersCache.getUsers()
  }
  next()
})

export default router
