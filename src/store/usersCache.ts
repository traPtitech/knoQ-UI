import {
  defineModule,
  defineGetters,
  defineMutations,
  defineActions,
  localGetterContext,
  localActionContext,
} from 'direct-vuex'
import { RepositoryFactory } from '@/repositories/RepositoryFactory'

const UsersRepo = RepositoryFactory.get('users')

interface State {
  users: Map<string, Schemas.User> | null
}

const state = (): State => ({
  users: null,
})

const getters = defineGetters<State>()({
  nameById(...args) {
    const { state } = usersCacheGettersContext(args)
    return (id: string) => state.users.get(id).name
  },
})

// Note:
// Vue does not make Map object reactive. Therefore,
//     state.users.set(k, v)
// does not trigger re-rendering.
const mutations = defineMutations<State>()({
  SET_USERS(state, users: Schemas.User[]): void {
    const usersMap = new Map<string, Schemas.User>()
    users.forEach(user => usersMap.set(user.userId, user))
    // Next line triggers re-rendering since this simply updates
    // one field of object.
    state.users = usersMap
  },
})

const actions = defineActions({
  async getUsers(context) {
    const { commit } = usersCacheActionContext(context)
    const { data } = await UsersRepo.get()
    commit.SET_USERS(data)
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
