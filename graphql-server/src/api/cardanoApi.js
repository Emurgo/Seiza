// @flow
import axios from 'axios'
import _ from 'lodash'

const URL: string = 'https://cardanoexplorer.com/api/'

export type CardanoAPI = {
  get: (path: string, query: any) => Promise<any>,
}

// Note: Later we could have some separate api facade, but for its seems to be an overhead
const cardanoAPI: CardanoAPI = {
  get: (path, query) => {
    const url = `${URL}${path}`
    // remove entries with null/undefined value
    const params = _(query)
      .toPairs()
      .filter(([k, v]) => v != null)
      .fromPairs()
      .value()

    return axios.get(url, {params}).then(({data}) => data.Right)
  },
}

export default cardanoAPI
