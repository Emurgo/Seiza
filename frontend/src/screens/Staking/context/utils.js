// @flow

import React from 'react'
import queryString from 'query-string'
import {withRouter} from 'react-router'
import {compose} from 'redux'

const QUERY_STRING_CONFIG = {arrayFormat: 'bracket'}

export const objToQueryString = (obj: {}) => queryString.stringify(obj, QUERY_STRING_CONFIG)

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

    const getQueryParam = (paramKey) => {
      const parsed = queryString.parse(location.search, QUERY_STRING_CONFIG)
      return parsed[paramKey]
    }

    return (
      <BaseComponent getQueryParam={getQueryParam} setQueryParam={setQueryParam} {...restProps} />
    )
  }
)
