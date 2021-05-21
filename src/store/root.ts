import { defineModule, defineMutations, defineActions } from 'direct-vuex'
import { rootActionContext } from '@/store'
import api, { ResponseUser } from '@/api'

interface State {
  me: ResponseUser | null
}

const state = (): State => ({
  me: null,
})

const mutations = defineMutations<State>()({
  SET_ME(state, me: ResponseUser): void {
    state.me = me
  },
})

const actions = defineActions({
  async getMe(context) {
    const { commit } = rootActionContext(context)
    const me = await api.users.getMe()
    commit.SET_ME(me)
  },
})

const root = defineModule({
  state,
  mutations,
  actions,
})
export default root
