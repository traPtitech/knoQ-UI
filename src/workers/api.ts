import axios, { AxiosPromise } from 'axios'

export const baseURL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api' : '/api'
export const icalURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api/ical/v1'
    : `${window.location.origin}/api/ical/v1`
const traQAPIBaseURL = 'https://q.trap.jp/api/1.0'

const authAPI = axios.create({
  baseURL,
})

interface AuthParams {
  url: string
}

export const fetchAuthParams = (): AxiosPromise<AuthParams> => {
  return authAPI.post('/authParams')
}

export const redirectToAuthPage = (ap: AuthParams) => {
  window.location.assign(ap.url)
}
