import axios from 'axios'

const URL = 'https://cardanoexplorer.com/api/'

export default {
  get: (endpoint) => axios.get(`${URL}${endpoint}`),
}
