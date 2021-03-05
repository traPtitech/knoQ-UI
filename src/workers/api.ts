import axios, { AxiosPromise } from 'axios'

export const baseURL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:6006/api' : '/api'
export const icalURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:6006/api/ical/v1'
    : `${window.location.origin}/api/ical/v1`
const traQAPIBaseURL = 'https://q.trap.jp/api/1.0'

const authAPI = axios.create({
  baseURL,
})

interface AuthParams {
  state: string
  codeChallenge: string
  clientId: string
}

export const fetchAuthParams = (): AxiosPromise<AuthParams> => {
  return authAPI.post('/authParams')
}

export const redirectToAuthPage = (codes: AuthParams) => {
  const authEndpointURL = new URL(`${traQAPIBaseURL}/oauth2/authorize`)
  authEndpointURL.searchParams.set('response_type', 'code')
  authEndpointURL.searchParams.set('client_id', codes.clientId)
  authEndpointURL.searchParams.set('state', codes.state)
  authEndpointURL.searchParams.set('code_challenge', codes.codeChallenge)
  authEndpointURL.searchParams.set('code_challenge_method', 'S256')

  window.location.assign(authEndpointURL.href)
}
