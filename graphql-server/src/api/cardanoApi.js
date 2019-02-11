// @flow
import axios from 'axios'

const URL: string = 'https://cardanoexplorer.com/api/'

export type CardanoAPI = {
  get: (path: string, query: any) => Promise<any>,
}

// Note: Later we could have some separate api facade, but for its seems to be an overhead
const cardanoAPI: CardanoAPI = {
  get: (path, query) => {
    const url = `${URL}${path}`
    return axios.get(url, {params: query}).then(({data}) => data.Right)
  },
}

export default cardanoAPI
