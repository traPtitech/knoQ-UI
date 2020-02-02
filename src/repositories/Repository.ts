import axios from 'axios'
import { baseURL, fetchAuthParams, redirectToAuthPage } from '@/utils/api'
import PathStorage from '@/utils/PathStorage'

const api = axios.create({
  baseURL,
})

api.interceptors.response.use(null, async err => {
  if (err.response.status === 401) {
    // if unauthorized
    const { data: authParams } = await fetchAuthParams()
    PathStorage.saveCurrentPath()
    redirectToAuthPage(authParams)
  }
  return Promise.reject(err)
})

export default api
