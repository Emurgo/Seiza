// @flow
import axios from 'axios'

const URL: string = 'https://cardanoexplorer.com/api/'

export type CardanoAPI = {
  get: (endpoint: string) => Promise<any>,
}

// Note: Later we could have some separate api facade, but for its seems to be an overhead
const cardanoAPI: CardanoAPI = {
  get: (endpoint) => axios.get(`${URL}${endpoint}`).then(({data}) => data.Right),
}

export default cardanoAPI
