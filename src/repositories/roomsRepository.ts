import { AxiosPromise } from 'axios'
import Repository from '@/repositories/Repository'

const resource = '/rooms'

export default {
  get(
    params: API.Rooms.Get.Params
  ): AxiosPromise<API.Rooms.Get.Responses.$200> {
    return Repository.get(resource, { params })
  },

  post(
    body: API.Rooms.Post.RequestBody
  ): AxiosPromise<API.Rooms.Post.Responses.$201> {
    return Repository.post(resource, body)
  },

  private: {
    post(
      body: API.Rooms.Post.RequestBody
    ): AxiosPromise<API.Rooms.Post.Responses.$201> {
      return Repository.post(`${resource}/private`, body)
    },

    delete(roomId: string): AxiosPromise<void> {
      return Repository.delete(`${resource}/private/${roomId}`)
    },
  },

  $roomId: (roomId: string) => ({
    get(): AxiosPromise<API.Rooms.$RoomId.Get.Responses.$200> {
      return Repository.get(`${resource}/${roomId}`)
    },

    delete(): AxiosPromise<void> {
      return Repository.delete(`${resource}/${roomId}`)
    },
  }),

  all: {
    post(): AxiosPromise<API.Rooms.All.Post.Responses.$201> {
      return Repository.post(`${resource}/all`)
    },
  },
}
