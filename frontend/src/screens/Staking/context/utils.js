// @flow

import {useCallback} from 'react'
import useReactRouter from 'use-react-router'

import * as urlUtils from '@/helpers/url'
import * as storage from '@/helpers/localStorage'

// Note: dont set `defaultValue` in below function to `null` as due to query-string api,
// we sometimes need default value to be `undefined` which `null` overrides

// Consider moving to `storage` module and use JSON for everything
export const getStorageData = (key: string, defaultValue: any) => {
  try {
    return JSON.parse(storage.getItem(key)) || defaultValue
  } catch (err) {
    return defaultValue
  }
}

export const useUrlManager = () => {
  const {history, location} = useReactRouter()

  const setQueryParam = useCallback(
    (key: string, value: any) => {
      history.replace({
        pathname: location.pathname,
        search: urlUtils.replaceQueryParam(location.search, key, value),
      })
    },
    [history, location]
  )

  const getQueryParam = useCallback(
    (paramKey: string, defaultValue: any): any => {
      const parsed = urlUtils.parse(location.search)
      return parsed[paramKey] || defaultValue
    },
    [history, location]
  )

  return {setQueryParam, getQueryParam}
}

export const useManageSimpleContextValue = (
  storageKey: string,
  defaultValue: any,
  transformValue: Function = (v) => v
) => {
  const {setQueryParam, getQueryParam} = useUrlManager()
  const value = getQueryParam(storageKey, defaultValue)

  const setValue = useCallback(
    (value: any) => {
      storage.setItem(storageKey, JSON.stringify(value))
      setQueryParam(storageKey, value)
    },
    [setQueryParam]
  )

  const _setStorageFromQuery = useCallback(
    (query: string) => {
      setValue(query)
    },
    [setValue]
  )

  const _storageToQuery = useCallback(() => {
    const value = getStorageData(storageKey, defaultValue)
    return urlUtils.objToQueryString({[storageKey]: value})
  })
  return {value, setValue, _setStorageFromQuery, _storageToQuery}
}
