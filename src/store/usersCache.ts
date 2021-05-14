import {
  defineModule,
  defineGetters,
  defineMutations,
  defineActions,
  localGetterContext,
  localActionContext,
} from 'direct-vuex'
import { isUser } from '@/workers/isUser'
import api, { ResponseUser } from '@/api'

interface State {
  users: Map<string, ResponseUser> | null
}

const state = (): State => ({
  users: null,
})

const getters = defineGetters<State>()({
  nameById(...args) {
    const { state } = usersCacheGettersContext(args)
    return (id: string) => state.users?.get(id)?.name
  },
})

// Note:
// Vue does not make Map object reactive. Therefore,
//     state.users.set(k, v)
// does not trigger re-rendering.
const mutations = defineMutations<State>()({
  SET_USERS(state, users: ResponseUser[]): void {
    const usersMap = new Map<string, ResponseUser>()
    users.forEach(user => {
      if (isUser(user.name)) usersMap.set(user.id, user)
    })
    // Next line triggers re-rendering since this simply updates
    // one field of object.
    state.users = usersMap
  },
})

const actions = defineActions({
  async getUsers(context) {
    const { commit } = usersCacheActionContext(context)
    const users = await api.users.getUsers({})
    commit.SET_USERS(users)
  },
})

const usersCache = defineModule({
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
})

export default usersCache
export const usersCacheGettersContext = (args: [any, any, any, any]) =>
  localGetterContext(args, usersCache)
export const usersCacheActionContext = (context: any) =>
  localActionContext(context, usersCache)
