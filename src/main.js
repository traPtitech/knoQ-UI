import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import marked from 'marked'
import router from './router'
import store from './store'

Vue.config.productionTip = false

marked.setOptions({ breaks: true })
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
