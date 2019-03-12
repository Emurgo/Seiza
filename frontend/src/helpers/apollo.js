// @flow
import {defaultDataIdFromObject} from 'apollo-cache-inmemory'

// Todo: add more for proper per-object caching
const TYPENAME_TO_PRIMARY_KEY = {
  BootstrapEraStakePool: 'poolHash',
}

export const dataIdFromObject = (obj: Object) => {
  const keyName = TYPENAME_TO_PRIMARY_KEY[obj.__typename]
  if (keyName && obj[keyName]) {
    return `${obj.__typename}:${obj[keyName]}`
  }
  return defaultDataIdFromObject(obj)
}
