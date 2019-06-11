// @flow
import assert from 'assert'
import _ from 'lodash'
import queryString from 'query-string'

const QUERY_STRING_CONFIG = {arrayFormat: 'bracket'}

export const parse = (query: string) => queryString.parse(query, QUERY_STRING_CONFIG)

export const stringify = (queryObj: {}): string =>
  queryString.stringify(queryObj, QUERY_STRING_CONFIG)

export const objToQueryString = (obj: {}) => stringify(obj)

export const replaceQueryParam = (query: string, key: string, value: string) => {
  // eslint-disable-next-line no-unused-vars
  const {[key]: old, ...rest} = parse(query)
  return stringify(value == null ? rest : {...rest, [key]: value})
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

// Note: without Object.freeze
// $Values<typeof > doens't work as expected
const EMBEDDABLE_MIMETYPES = Object.freeze({
  SVG: 'image/svg+xml',
})

type EmbeddableMimetype = $Values<typeof EMBEDDABLE_MIMETYPES>

// Naming is here to remind us of
// vulnerability if data is non-sanitized
export const dangerouslyEmbedIntoDataURI = (mimetype: EmbeddableMimetype, data: string) => {
  assert(Object.values(EMBEDDABLE_MIMETYPES).includes(mimetype))
  return `data:${mimetype};utf8,${encodeURIComponent(data)}`
}
