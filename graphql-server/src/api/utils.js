import _ from 'lodash'
import axios from 'axios'
import {setupCache} from 'axios-cache-adapter'

export const objStripNullValues = (obj) =>
  _(obj)
    .toPairs()
    .filter(([k, v]) => v != null)
    .fromPairs()
    .value()

/* for future use
const buildPath = (prefix: string, path: Array<string>) => {
  const pathStr = path.map(encodeURIComponent).join('/')
  return `${prefix}${pathStr}`
}
*/

export const getCachedApi = ({maxAge, limit}) => {
  const cache = setupCache({
    maxAge: maxAge || 0,
    exclude: {
      query: false,
    },
    // https://github.com/RasCarlito/axios-cache-adapter/issues/31
    key: (req) => req.url + JSON.stringify(req.params),
    limit: limit || false,
  })

  const api = axios.create({
    adapter: cache.adapter,
  })

  return api
}
