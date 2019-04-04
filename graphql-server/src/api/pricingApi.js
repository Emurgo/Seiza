// @flow
import axios from 'axios'
import {setupCache} from 'axios-cache-adapter'

import {objStripNullValues} from './utils'

const API_ROOT = 'https://min-api.cryptocompare.com/data/'

const cache = setupCache({
  maxAge: 20 * 1000,
  exclude: {
    query: false,
  },
  // https://github.com/RasCarlito/axios-cache-adapter/issues/31
  key: (req) => req.url + JSON.stringify(req.params),
  // Not: sure how to set this number, but we should probably not allow infinite space
  limit: 1000,
})

const api = axios.create({
  adapter: cache.adapter,
})

export const pricingAPI = {
  get: (path: string, query: any) => {
    const url = `${API_ROOT}${path}`
    // remove entries with null/undefined value
    const params = objStripNullValues(query)
    return api.get(url, {params}).then((r) => r.data)
  },
}
