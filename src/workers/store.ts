// ref: https://github.com/vuejs/vuex/issues/2212#issuecomment-1715259898
import { getCurrentInstance } from 'vue'
export const useStore = () => {
  const vm = getCurrentInstance()
  if (!vm) throw new Error('must be called in setup')
  return vm.proxy.$store
}
