import Repository from './Repository'

const resource = '/rooms'

export default {
  get(payload) {
    return Repository.get(`${resource}`, {
      params: {
        id: payload.id,
        date_begin: payload.dateBegin,
        date_end: payload.dateEnd,
      },
    })
  },

  postAll() {
    return Repository.post(`/admin${resource}/all`)
  },
}
