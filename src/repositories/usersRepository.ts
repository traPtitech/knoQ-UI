import { AxiosPromise } from 'axios'
import Repository from '@/repositories/Repository'

const resource = '/users'

export default {
  get(): AxiosPromise<API.Users.Get.Responses.$200> {
    return Repository.get(resource)
  },

  me: {
    get(): AxiosPromise<API.Users.Me.Get.Responses.$200> {
      return Repository.get(`${resource}/me`)
    },

    events: {
      get(): AxiosPromise<API.Users.Me.Events.Get.Responses.$200> {
        return Repository.get(`${resource}/me/events`)
      },
    },

    groups: {
      get(): AxiosPromise<API.Users.Me.Groups.Get.Responses.$200> {
        return Repository.get(`${resource}/me/groups`)
      },
    },

    ical: {
      get(): AxiosPromise<API.Users.Me.Ical.Get.Responses.$200> {
        return Repository.get(`${resource}/me/ical`)
      },

      put(): AxiosPromise<API.Users.Me.Ical.Get.Responses.$200> {
        return Repository.put(`${resource}/me/ical`)
      },
    },
  },
}
