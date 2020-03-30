import axios from 'axios'
import { baseURL, fetchAuthParams, redirectToAuthPage } from '@/workers/api'
import PathStorage from '@/workers/PathStorage'

const api = axios.create({
  baseURL,
  withCredentials: true,
})

api.interceptors.response.use(null, async err => {
  if (err.response && err.response.status === 401) {
    // if unauthorized
    const { data: authParams } = await fetchAuthParams()
    PathStorage.saveCurrentPath()
    redirectToAuthPage(authParams)
  }
  return Promise.reject(err)
})

export default api
