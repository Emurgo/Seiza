// @flow
import axios from 'axios'

const URL = 'https://cardanoexplorer.com/api/'

// Note: Later we could have some separate api facade, but for its seems to be an overhead
export default {
  get: (endpoint) => axios.get(`${URL}${endpoint}`).then(({data}) => data.Right),
}
