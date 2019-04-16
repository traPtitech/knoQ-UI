import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  url: '/reservations',
  headers: { 'X-Showcase-User': 'fuji' }
})

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    reservations: [],
    revHeaders: [
      { text: '識別id', value: 'id' },
      { text: 'グループID', value: 'group_id' },
      { text: '部屋ID', value: 'room_id' },
      { text: '日付', value: 'date' },
      { text: '開始時刻', value: 'time_start' },
      { text: '終了時刻', value: 'time_end' }
    ]
  },
  mutations: {
    changeReservation (state, payload) {
      state.reservations = payload
    }
  },
  actions: {
    getReservations ({ commit }, payload) {
      instance.get('/reservations', {
        params: {
          userid: payload.traQID,
          date_begin: payload.dateBegin,
          date_end: payload.dateEnd
        }
      })
        .then(function (response) {
          console.log(response)
          commit('changeReservation', response.data)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
})
