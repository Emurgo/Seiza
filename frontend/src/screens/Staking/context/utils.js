// @flow

import React from 'react'
import {withRouter} from 'react-router'
import {compose} from 'redux'

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

export const withUrlManager = compose(
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
