import Repository from './Repository'

const resource = '/rooms'

export default {
  get (payload) {
    return Repository.get(`${resource}`, {
      params: {
        date_begin: payload.dateBegin,
        date_end: payload.dateEnd
      }
    })
  }
}
