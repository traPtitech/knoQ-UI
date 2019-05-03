import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:3000/api'
})

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginUser: {},
    allUsers: [],
    reservations: [],
    revHeaders: [
      { text: '識別id', value: 'id' },
      { text: 'グループID', value: 'group_id' },
      { text: '部屋ID', value: 'room_id' },
      { text: '日付', value: 'date' },
      { text: '開始時刻', value: 'time_start' },
      { text: '終了時刻', value: 'time_end' },
      { text: '場所', value: 'room.place' }
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
    },
    setLoginUser (state, payload) {
      state.loginUser = payload
    },
    setAllUsers (state, users) {
      state.allUsers = users
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
    },
    gettraQIDs: (state) => {
      let users = []
      state.allUsers.forEach(element => {
        users.push(element.traq_id)
      })
      return users
    }
  },
  actions: {
    getUserMe: async function ({ commit }) {
      try {
        const response = await instance.get('/users/me')
        console.log(response)
        await commit('setLoginUser', response.data)
      } catch (error) {
        console.error(error)
      }
    },
    getGroups: async function ({ commit }, traQID) {
      try {
        const response = await instance.get('/groups', {
          params: {
            traQID: traQID
          }
        })
        console.log(response)
        commit('changeGroups', response.data)
      } catch (error) {
        console.log(error)
      }
    },
    getReservations ({ commit }, payload) {
      instance.get('/reservations', {
        params: {
          traQID: payload.traQID,
          groupid: payload.groupID,
          date_begin: payload.dateBegin,
          date_end: payload.dateEnd
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
    },
    postReservation ({ commit }, payload) {
      instance.post('/reservations', {
        name: payload.name,
        description: payload.description,
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
    postGroup ({ commit }, group) {
      instance.post('/groups', group)
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
    },
    getUsers ({ commit }) {
      instance.get('/users', {}
      )
        .then(function (response) {
          console.log(response)
          commit('setAllUsers', response.data)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
})
