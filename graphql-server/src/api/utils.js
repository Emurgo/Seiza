import _ from 'lodash'

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
