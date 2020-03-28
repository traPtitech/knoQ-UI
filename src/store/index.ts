import Vue from 'vue'
import Vuex from 'vuex'
import { createDirectStore } from 'direct-vuex'
import root from '@/store/root'
import usersCache from '@/store/usersCache'

Vue.use(Vuex)

const { store, rootGetterContext, rootActionContext } = createDirectStore({
  ...root,
  modules: {
    usersCache,
  },
})

export default store
export { rootGetterContext, rootActionContext }

declare module 'vuex' {
  interface Store<S> {
    direct: typeof store
  }
}
