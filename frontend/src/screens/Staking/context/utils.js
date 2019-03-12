// @flow

import React from 'react'
import {withRouter} from 'react-router'
import {compose} from 'redux'
import {withProps, withHandlers} from 'recompose'

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

type ManagerProps = {|
  getQueryParam: any,
  setQueryParam: any,
|}

export const withUrlManager = <Props>(
  BaseComponent: React$ComponentType<{|...Props, ...ManagerProps|}>
): React$ComponentType<Props> => {
  const enhancer = compose(
    withRouter,
    (BaseComponent) => ({history, location, match, ...restProps}) => {
      const setQueryParam = (key, value) => {
        history.replace({
          pathname: location.pathname,
          search: urlUtils.replaceQueryParam(location.search, key, value),
        })
      }

      const getQueryParam = (paramKey, defaultValue) => {
        const parsed = urlUtils.parse(location.search)
        return parsed[paramKey] || defaultValue
      }

      return (
        <BaseComponent getQueryParam={getQueryParam} setQueryParam={setQueryParam} {...restProps} />
      )
    }
  )
  return enhancer(BaseComponent)
}

type SimpleValueHocProps = {|
  value: any,
  setValue: Function,
  _setStorageFromQuery: Function,
  _storageToQuery: Function,
|}

// Note/Todo (richard): I could not type this HOC using exact props in `React$ComponentType` due
// to error in `withHandlers`, soon rewrite to hooks might help
// Performs updates of a single value, and exposes url/storage sync methods
export const withManageSimpleContextValue = (
  storageKey: string,
  defaultValue: any,
  transformValue: Function = (v) => v
) => <Props>(
  BaseComponent: React$ComponentType<{...Props, ...SimpleValueHocProps, ...ManagerProps}>
): React$ComponentType<Props> => {
  const enhancer = compose(
    withUrlManager,
    withProps((props) => ({
      value: props.getQueryParam(storageKey, defaultValue),
    })),
    withHandlers({
      setValue: ({setQueryParam}) => (value) => {
        storage.setItem(storageKey, JSON.stringify(value))
        setQueryParam(storageKey, value)
      },
    }),
    withHandlers({
      _setStorageFromQuery: ({setValue, getQueryParam}) => (query) => {
        setValue(getQueryParam(storageKey, defaultValue))
      },
      _storageToQuery: () => () => {
        const value = getStorageData(storageKey, defaultValue)
        return urlUtils.objToQueryString({[storageKey]: value})
      },
    })
  )
  return enhancer(BaseComponent)
}
