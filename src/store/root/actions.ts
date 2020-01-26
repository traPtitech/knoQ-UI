import { createActions } from 'direct-vuex'
import { rootActionContext } from '@/store'
import { RepositoryFactory } from '@/repositories/RepositoryFactory'

const UsersRepository = RepositoryFactory.get('users')

export const actions = createActions({
  async getMe(context) {
    const { commit } = rootActionContext(context)
    const { data: me } = await UsersRepository.me.get()
    commit.SET_ME(me)
  },
})
