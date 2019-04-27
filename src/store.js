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
    myGroups: [],
    groupHeaders: [
      { text: '識別id', value: 'id' },
      { text: 'グループ名', value: 'name' }
    ],
    allowedRooms: []
  },
  mutations: {
    changeReservations (state, payload) {
      state.reservations = payload
    },
    changeGroups (state, payload) {
      state.myGroups = payload
    },
    checkRooms (state, payload) {
      state.allowedRooms = payload
    }
  },
  getters: {
    getRoomIDs: (state) => {
      let rooms = []
      state.allowedRooms.forEach(element => {
        rooms.push(element.id)
      })
      return rooms
    },
    getGroupIDs: (state) => {
      let groups = []
      state.myGroups.forEach(element => {
        groups.push(element.id)
      })
      return groups
    }
  },
  actions: {
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
    },
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
    postReservation ({ commit }, payload) {
      instance.post('/reservations', {
        group_id: parseInt(payload.group_id),
        room_id: parseInt(payload.room_id),
        time_start: payload.time_start,
        time_end: payload.time_end
      })
        .then(function (response) {
          console.log(response)
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    getRooms ({ commit }, payload) {
      instance.get('/rooms', {
        params: {
          date_begin: payload,
          date_end: payload
        }
      })
        .then(function (response) {
          console.log(response)
          commit('checkRooms', response.data)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
})
