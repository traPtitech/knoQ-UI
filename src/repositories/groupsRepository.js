import Repository from './Repository'

const resource = '/groups'

export default {
  get (payload) {
    return Repository.get(`${resource}`, {
      params: {
        id: payload.id,
        traQID: payload.traQID
      }
    })
  },

  post (payload) {
    return Repository.post(`${resource}`, payload)
  }
}
