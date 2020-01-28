import Vue from 'vue'
import Vuex from 'vuex'
import { RepositoryFactory } from '@/repositories/RepositoryFactory'

const GroupsRepository = RepositoryFactory.get('groups')
const UsersRepository = RepositoryFactory.get('users')
// const RoomsRepository = RepositoryFactory.get('rooms')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginUser: { traq_id: '', admin: false },
    allUsers: [],
    myReservations: [],
    revHeaders: [
      { text: '識別id', value: 'id' },
      { text: 'グループID', value: 'group_id' },
      { text: '部屋ID', value: 'room_id' },
      { text: '日付', value: 'date' },
      { text: '開始時刻', value: 'time_start' },
      { text: '終了時刻', value: 'time_end' },
      { text: '場所', value: 'room.place' },
    ],
    myGroups: [{ id: 0, members: [], created_by_refer: '' }],
    groupHeaders: [
      { text: 'グループ名', value: 'name' },
      { text: '人数', value: 'members.length' },
      { text: '作成者', value: 'created_by_refer' },
    ],
    roomHeaders: [
      { text: '日付', value: 'date' },
      { text: '場所', value: 'place' },
      { text: '開始時刻', value: 'time_start' },
      { text: '終了時刻', value: 'time_end' },
    ],
  },
  mutations: {
    changeMyReservations(state, payload) {
      state.myReservations = payload
    },
    changeMyGroups(state, payload) {
      state.myGroups = payload
    },
    setLoginUser(state, payload) {
      state.loginUser = payload
    },
    setAllUsers(state, users) {
      state.allUsers = users
    },
  },
  getters: {
    getGroupIDs: state => {
      let groups = []
      state.myGroups.forEach(element => {
        groups.push(element.id)
      })
      return groups
    },
    gettraQIDs: state => {
      let users = []
      state.allUsers.forEach(element => {
        users.push(element.traq_id)
      })
      return users
    },
  },
  actions: {
    getUserMe: async function({ commit }) {
      if (!Object.keys(this.state.loginUser).length) {
        try {
          const response = await UsersRepository.me.get()
          console.log(response)
          await commit('setLoginUser', response.data)
        } catch (error) {
          console.error(error)
        }
      }
    },
    getMyGroups: async function({ commit }) {
      const traQID = this.state.loginUser.traq_id
      console.log(traQID)
      try {
        const response = await UsersRepository.me.groups.get()
        console.log(response)
        commit('changeMyGroups', response.data)
      } catch (error) {
        console.log(error)
      }
    },
    async getUsers({ commit }) {
      if (this.state.allUsers.length === 0) {
        try {
          const response = await UsersRepository.get()
          console.log(response)
          await commit('setAllUsers', response.data)
        } catch (error) {
          console.log(error)
        }
      }
    },
  },
})
