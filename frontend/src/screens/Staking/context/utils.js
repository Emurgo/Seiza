// @flow

import React from 'react'
import queryString from 'query-string'
import {withRouter} from 'react-router'
import {compose} from 'redux'

import * as storage from '@/helpers/localStorage'

const QUERY_STRING_CONFIG = {arrayFormat: 'bracket'}

export const objToQueryString = (obj: {}) => queryString.stringify(obj, QUERY_STRING_CONFIG)

// Consider moving to `storage` module and use JSON for everything
export const getStorageData = (key: string, defaultValue: ?string = null) => {
  try {
    return JSON.parse(storage.getItem(key)) || defaultValue
  } catch (err) {
    return defaultValue
  }
}

const replaceQueryString = (query, key, value) => {
  return queryString.stringify(
    {
      ...queryString.parse(query, QUERY_STRING_CONFIG),
      [key]: value,
    },
    QUERY_STRING_CONFIG
  )
}

export const withUrlManager = compose(
  withRouter,
  (BaseComponent) => ({history, location, match, ...restProps}) => {
    const setQueryParam = (key, value) => {
      history.replace({
        pathname: location.pathname,
        search: replaceQueryString(location.search, key, value),
      })
    }

    const getQueryParam = (paramKey, defaultValue: ?string = null) => {
      const parsed = queryString.parse(location.search, QUERY_STRING_CONFIG)
      return parsed[paramKey] || defaultValue
    }

    return (
      <BaseComponent getQueryParam={getQueryParam} setQueryParam={setQueryParam} {...restProps} />
    )
  }
)
