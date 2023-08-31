import Vue from 'vue'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import rules from '@/workers/rules'
import { Buffer } from 'buffer'

window.Buffer = window.Buffer || Buffer

Vue.config.productionTip = false
Vue.prototype.$rules = rules

new Vue({
  vuetify,
  router,
  store: store.original,
  render: h => h(App),
}).$mount('#app')
