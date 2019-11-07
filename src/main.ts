import Vue from 'vue'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import marked from 'marked'
import moment from 'moment'
import router from '@/router/router'
import store from '@/store/store'

Vue.config.productionTip = false

marked.setOptions({ breaks: true })

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App),
}).$mount('#app')

moment.locale('ja', {
  weekdays: [
    '日曜日',
    '月曜日',
    '火曜日',
    '水曜日',
    '木曜日',
    '金曜日',
    '土曜日',
  ],
  weekdaysShort: ['日', '月', '火', '水', '木', '金', '土'],
})
