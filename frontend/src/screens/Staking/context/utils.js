// @flow

import * as React from 'react'
import _ from 'lodash'

import * as urlUtils from '@/helpers/url'
import localStorage from '@/helpers/localStorage'
import sessionStorage from '@/helpers/sessionStorage'
import {useUrlManager} from '@/hooks/useUrlManager'

// Note: dont set `defaultValue` in below function to `null` as due to query-string api,
// we sometimes need default value to be `undefined` which `null` overrides

export type ProviderProps = {|
  children: React.Node,
  autoSync: ?boolean,
|}

export const getStorageData = (key: string, defaultValue: any, autoSync: ?boolean) => {
  if (autoSync === false) {
    return sessionStorage.getItem(key) || defaultValue
  }
  // This also applies for `null` case, when `autoSync` was not determined yet
  return localStorage.getItem(key) || defaultValue
}

export const useManageSimpleContextValue = (
  autoSync: ?boolean,
  storageKey: string,
  defaultValue: any,
  transformValue: Function = (v) => v
) => {
  const {setQueryParam, getQueryParam} = useUrlManager()
  const value = transformValue(getQueryParam(storageKey) || defaultValue)

  const setValue = React.useCallback(
    (value: any) => {
      autoSync && localStorage.setItem(storageKey, value)
      sessionStorage.setItem(storageKey, value)
      setQueryParam(storageKey, value)
    },
    [autoSync, setQueryParam, storageKey]
  )

  const equalsDefault = _.isEqual(value, defaultValue)

  const _setStorageFromQuery = React.useCallback(
    (query: string) => {
      const value = getQueryParam(storageKey, query)
      setValue(value)
    },
    [getQueryParam, setValue, storageKey]
  )

  const _storageToQuery = React.useCallback(() => {
    const value = getStorageData(storageKey, defaultValue, autoSync)
    return urlUtils.objToQueryString({[storageKey]: value})
  }, [autoSync, storageKey, defaultValue])

  const _setStorageToDefault = React.useCallback(() => {
    autoSync && localStorage.setItem(storageKey, defaultValue)
    sessionStorage.setItem(storageKey, defaultValue)
  }, [autoSync, storageKey, defaultValue])

  return {
    value,
    setValue,
    equalsDefault,
    _setStorageFromQuery,
    _storageToQuery,
    _setStorageToDefault,
  }
}
