import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const client = 'fuji1'

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'X-Showcase-User': client }
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
    ],
    groups: [],
    groupHeaders: [
      { text: '識別id', value: 'id' },
      { text: 'グループ名', value: 'name' }
    ]
  },
  mutations: {
    changeReservations (state, payload) {
      state.reservations = payload
    },
    changeGroups (state, payload) {
      state.groups = payload
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
          commit('changeReservations', response.data)
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    initGet ({ commit }) {
      instance.get('/reservations', {
        params: {
          userid: client
        }
      })
        .then(function (response) {
          console.log(response)
          for (let i = 0; i < response.data.length; i++) {
            let date
            date = new Date(response.data[i].date)
            response.data[i].date = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
          }
          commit('changeReservations', response.data)
        })
        .catch(function (error) {
          console.log(error)
        })
      instance.get('/groups', {
        params: {
          userid: client
        }
      })
        .then(function (response) {
          console.log(response)
          commit('changeGroups', response.data)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
})
