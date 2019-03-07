// @flow

import _ from 'lodash'
import queryString from 'query-string'

const QUERY_STRING_CONFIG = {arrayFormat: 'bracket'}

export const parse = (query: string) => queryString.parse(query, QUERY_STRING_CONFIG)

export const stringify = (queryObj: {}): string =>
  queryString.stringify(queryObj, QUERY_STRING_CONFIG)

export const objToQueryString = (obj: {}) => stringify(obj)

export const replaceQueryParam = (query: string, key: string, value: string) => {
  return stringify({
    ...parse(query),
    [key]: value,
  })
}

export const areQueryStringsSame = (query1: string, query2: string): boolean => {
  const parsed1 = parse(query1)
  const parsed2 = parse(query2)
  return _.isEqual(parsed1, parsed2)
}

export const joinQueryStrings = (queryStrings: Array<string>): string => {
  const nonEmptyQueryStrings = queryStrings.filter((query) => query)
  return nonEmptyQueryStrings.length ? `?${nonEmptyQueryStrings.join('&')}` : ''
}
