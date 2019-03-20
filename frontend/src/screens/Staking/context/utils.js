// @flow

import * as React from 'react'

import useReactRouter from 'use-react-router'

import * as urlUtils from '@/helpers/url'
import * as storage from '@/helpers/localStorage'

// Note: dont set `defaultValue` in below function to `null` as due to query-string api,
// we sometimes need default value to be `undefined` which `null` overrides

export type ProviderProps = {|
  children: React.Node,
|}

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

  const setQueryParam = React.useCallback(
    (key: string, value: any) => {
      history.replace({
        pathname: location.pathname,
        search: urlUtils.replaceQueryParam(location.search, key, value),
      })
    },
    [history, location]
  )

  const getQueryParam = React.useCallback(
    (paramKey: string, query?: string): any => {
      const parsed = urlUtils.parse(query || location.search)
      return parsed[paramKey]
    },
    [location]
  )

  const setQuery = React.useCallback(
    (query: string) => {
      history.replace({
        pathname: location.pathname,
        search: query,
      })
    },
    [history, location]
  )

  return {setQueryParam, getQueryParam, setQuery}
}

export const useManageSimpleContextValue = (
  storageKey: string,
  defaultValue: any,
  transformValue: Function = (v) => v
) => {
  const {setQueryParam, getQueryParam} = useUrlManager()
  const value = transformValue(getQueryParam(storageKey) || defaultValue)

  const setValue = React.useCallback(
    (value: any) => {
      storage.setItem(storageKey, JSON.stringify(value))
      setQueryParam(storageKey, value)
    },
    [setQueryParam, storageKey]
  )

  const _setStorageFromQuery = React.useCallback(
    (query: string) => {
      const value = getQueryParam(storageKey, query)
      setValue(value)
    },
    [getQueryParam, setValue, storageKey]
  )

  const _storageToQuery = React.useCallback(() => {
    const value = getStorageData(storageKey, defaultValue)
    return urlUtils.objToQueryString({[storageKey]: value})
  }, [storageKey, defaultValue])

  const _setStorageToDefault = React.useCallback(() => {
    storage.setItem(storageKey, JSON.stringify(defaultValue))
  }, [storageKey, defaultValue])

  return {value, setValue, _setStorageFromQuery, _storageToQuery, _setStorageToDefault}
}
