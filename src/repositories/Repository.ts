import axios from 'axios'
import { baseURL, fetchAuthParams, redirectToAuthPage } from '@/workers/api'
import PathStorage from '@/workers/PathStorage'

const api = axios.create({
  baseURL,
  withCredentials: true,
})

api.interceptors.response.use(undefined, async err => {
  if (err?.response.headers['x-knoq-need-authorization']) {
    const { data: authParams } = await fetchAuthParams()
    PathStorage.saveCurrentPath()
    redirectToAuthPage(authParams)
  }
  return Promise.reject(err)
})

export default api
