import axios from 'axios'

const baseURL = 'http://192.168.11.4:3000/api'

export default axios.create({
  baseURL
})
