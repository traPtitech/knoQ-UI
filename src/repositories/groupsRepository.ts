import { AxiosPromise } from 'axios'
import Repository from '@/repositories/Repository'

const resource = '/groups'

export default {
  get(): AxiosPromise<API.Groups.Get.Responses.$200> {
    return Repository.get(resource)
  },

  post(
    body: API.Groups.Post.RequestBody
  ): AxiosPromise<API.Groups.Post.Responses.$201> {
    return Repository.post(resource, body)
  },

  $groupId: (groupId: string) => ({
    get(): AxiosPromise<API.Groups.$GroupId.Get.Responses.$200> {
      return Repository.get(`${resource}/${groupId}`)
    },

    put(
      body: API.Groups.$GroupId.Put.RequestBody
    ): AxiosPromise<API.Groups.$GroupId.Put.Responses.$200> {
      return Repository.put(`${resource}/${groupId}`, body)
    },

    delete(): AxiosPromise<void> {
      return Repository.delete(`${resource}/${groupId}`)
    },

    events: {
      get(): AxiosPromise<API.Groups.$GroupId.Events.Get.Resposes.$200> {
        return Repository.get(`${resource}/${groupId}/events`)
      },
    },

    members: {
      me: {
        put(): AxiosPromise<API.Groups.$GroupId.Members.Me.Put.Responses.$200> {
          return Repository.put(`${resource}/${groupId}/members/me`)
        },

        delete(): AxiosPromise<void> {
          return Repository.delete(`${resource}/${groupId}/members/me`)
        },
      },
    },
  }),
}
