import axios from 'axios'
import PathStorage from '@/utils/PathStorage'

const baseURL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api' : '/api'
const traQAPIBaseURL = 'https://q.trap.jp/api/1.0'

const api = axios.create({
  baseURL,
})

api.interceptors.response.use(null, async err => {
  if (err.response.status === 401) {
    // if unauthorized
    const codes = await fetchAuthParams()
    PathStorage.saveCurrentPath()
    redirectToAuthPage(codes)
  }
  return Promise.reject(err)
})

export default api

interface AuthParams {
  state: string
  codeChallenge: string
  clientId: string
}

const fetchAuthParams = async (): Promise<AuthParams> => {
  const res = await api.post('/authParams')
  return res.data
}

const redirectToAuthPage = (codes: AuthParams) => {
  const authEndpointURL = new URL(`${traQAPIBaseURL}/oauth/authorize`)
  authEndpointURL.searchParams.set('response_type', 'code')
  authEndpointURL.searchParams.set('client_id', codes.clientId)
  authEndpointURL.searchParams.set('state', codes.state)
  authEndpointURL.searchParams.set('code_challenge', codes.codeChallenge)
  authEndpointURL.searchParams.set('code_challenge_method', 'S256')

  window.location.assign(authEndpointURL.href)
}
