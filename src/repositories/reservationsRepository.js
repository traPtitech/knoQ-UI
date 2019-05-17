import Repository from './Repository'

const resource = '/reservations'

export default {
  get (payload) {
    return Repository.get(`${resource}`, {
      params: {
        traQID: payload.traQID,
        groupid: payload.groupID,
        date_begin: payload.dateBegin,
        date_end: payload.dateEnd
      }
    })
  },

  post (payload) {
    return Repository.post(`${resource}`, {
      name: payload.name,
      description: payload.description,
      group_id: parseInt(payload.group_id),
      room_id: parseInt(payload.room_id),
      time_start: payload.time_start,
      time_end: payload.time_end
    })
  }
}
