import Repository from './Repository'

const resource = '/groups'

export default {
  get (traQID) {
    return Repository.get(`${resource}`, {
      params: {
        traQID: traQID
      }
    })
  },

  post (payload) {
    return Repository.post(`${resource}`, payload)
  }
}
