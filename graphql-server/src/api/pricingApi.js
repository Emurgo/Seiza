// @flow
import axios from 'axios'

import {objStripNullValues} from './utils'

const API_ROOT = 'https://min-api.cryptocompare.com/data/'

export const pricingAPI = {
  get: (path: string, query: any) => {
    const url = `${API_ROOT}${path}`
    // remove entries with null/undefined value
    const params = objStripNullValues(query)
    return axios.get(url, {params}).then((r) => r.data)
  },
}
