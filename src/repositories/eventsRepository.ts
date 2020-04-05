import { AxiosPromise } from 'axios'
import Repository from '@/repositories/Repository'

const resource = '/events'

export default {
  get(
    params: API.Events.Get.Params = {}
  ): AxiosPromise<API.Events.Get.Responses.$200> {
    return Repository.get(resource, { params })
  },

  post(
    body: API.Events.Post.RequestBody
  ): AxiosPromise<API.Events.Post.Responses.$201> {
    return Repository.post(resource, body)
  },

  $eventId: (eventId: string) => ({
    get(): AxiosPromise<API.Events.$EventId.Get.Responses.$200> {
      return Repository.get(`${resource}/${eventId}`)
    },

    put(
      body: API.Events.$EventId.Put.RequestBody
    ): AxiosPromise<API.Events.$EventId.Put.Responses.$200> {
      return Repository.put(`${resource}/${eventId}`, body)
    },

    delete(): AxiosPromise<void> {
      return Repository.delete(`${resource}/${eventId}`)
    },

    tags: {
      post(
        body: API.Events.$EventId.Tags.Post.RequestBody
      ): AxiosPromise<API.Events.$EventId.Tags.Post.Responses.$200> {
        return Repository.post(`${resource}/${eventId}/tags`, body)
      },

      $tagName: (tagName: string) => ({
        delete(): AxiosPromise<void> {
          return Repository.delete(`${resource}/${eventId}/tags/${tagName}`)
        },
      }),
    },
  }),
}
