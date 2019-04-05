// @flow
import {objStripNullValues, getCachedApi} from './utils'

const API_ROOT = 'https://min-api.cryptocompare.com/data/'

// Not sure how to set `limit`, but we should probably not allow infinite space
const api = getCachedApi({maxAge: 20 * 1000, limit: 1000})

export const pricingAPI = {
  get: (path: string, query: any) => {
    const url = `${API_ROOT}${path}`
    // remove entries with null/undefined value
    const params = objStripNullValues(query)
    return api.get(url, {params}).then((r) => r.data)
  },
}
