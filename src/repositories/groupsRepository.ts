import Repository from './Repository'

const resource = '/groups'

export default {
  get(payload) {
    return Repository.get(`${resource}`, {
      params: {
        id: payload.id,
        name: payload.name,
        traQID: payload.traQID,
      },
    })
  },

  post(payload) {
    return Repository.post(`${resource}`, payload)
  },

  patch(id, payload) {
    return Repository.patch(`${resource}/${id}`, payload)
  },
}
