import { createModule } from 'direct-vuex'
import { state } from '@/store/root/state'
import { actions } from '@/store/root/actions'
import { mutations } from '@/store/root/mutations'
import { getters } from '@/store/root/getters'

export const root = createModule({
  state,
  actions,
  mutations,
  getters,
})
