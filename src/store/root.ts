import { defineModule, defineMutations, defineActions } from 'direct-vuex'
import { rootActionContext } from '@/store'
import RepositoryFactory from '@/repositories/RepositoryFactory'

const UsersRepo = RepositoryFactory.get('users')

interface State {
  me: Schemas.User | null
}

const state = (): State => ({
  me: null,
})

const mutations = defineMutations<State>()({
  SET_ME(state, me: Schemas.User): void {
    state.me = me
  },
})

const actions = defineActions({
  async getMe(context) {
    const { commit } = rootActionContext(context)
    const { data } = await UsersRepo.me.get()
    commit.SET_ME(data)
  },
})

const root = defineModule({
  state,
  mutations,
  actions,
})
export default root
