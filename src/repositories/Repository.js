import axios from 'axios'

let baseURL = '/api'

// buildするとproductionが入る
if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://localhost:3000/api'
}

export default axios.create({
  baseURL
})
