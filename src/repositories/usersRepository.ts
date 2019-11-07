import Repository from './Repository'

const resource = '/users'

export default {
  get() {
    return Repository.get(`${resource}`)
  },

  getMe() {
    return Repository.get(`${resource}/me`)
  },
}
