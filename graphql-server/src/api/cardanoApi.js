// @flow
import axios from 'axios'
import {objStripNullValues} from './utils'

const URL: string = 'https://cardanoexplorer.com/api/'

export type CardanoAPI = {
  get: (path: string, query: any) => Promise<any>,
}

// Note: Later we could have some separate api facade, but for its seems to be an overhead
const cardanoAPI: CardanoAPI = {
  get: (path, query) => {
    const url = `${URL}${path}`
    // remove entries with null/undefined value
    const params = objStripNullValues(query)
    return axios.get(url, {params}).then(({data}) => data.Right)
  },
}

export default cardanoAPI
