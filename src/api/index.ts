import * as API from '@/api/generated'
import { baseURL, fetchAuthParams, redirectToAuthPage } from '@/workers/api'
import PathStorage from '@/workers/PathStorage'

const authMiddleware: API.Middleware = {
  async post(ctx) {
    if (
      !ctx.response.ok &&
      ctx.response.headers.get('x-knoq-need-authorization')
    ) {
      const { data: authParams } = await fetchAuthParams()
      PathStorage.saveCurrentPath()
      redirectToAuthPage(authParams)
    }
  },
}

const config: API.Configuration = new API.Configuration({
  basePath: baseURL,
  middleware: [authMiddleware],
})

const api = {
  auth: new API.ActivityApi(config),
  events: new API.EventsApi(config),
  groups: new API.GroupsApi(config),
  ical: new API.ICalApi(config),
  rooms: new API.RoomsApi(config),
  tags: new API.TagsApi(config),
  users: new API.UsersApi(config),
}

export default api
export * from '@/api/generated'
