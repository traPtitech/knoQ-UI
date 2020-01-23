import { AxiosPromise } from 'axios'
import Repository from '@/repositories/Repository'

const resource = '/tags'

export default {
  get(): AxiosPromise<API.Tags.Get.Responses.$200> {
    return Repository.get(resource)
  },

  post(
    body: API.Tags.Post.RequestBody
  ): AxiosPromise<API.Tags.Post.Response.$200> {
    return Repository.post(resource, body)
  },
}
