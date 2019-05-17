import Repository from './Repository'

const resource = '/rooms'

export default {
  get (payload) {
    return Repository.get(`${resource}`, {
      params: {
        date_begin: payload,
        date_end: payload
      }
    })
  }
}
