// @flow

import * as React from 'react'

import useReactRouter from 'use-react-router'

import * as urlUtils from '@/helpers/url'

export const useUrlManager = () => {
  const {history, location} = useReactRouter()

  const setQueryParam = React.useCallback(
    (key: string, value: any) => {
      history.replace({
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
        search: query,
      })
    },
    [history]
  )

  return {setQueryParam, getQueryParam, setQuery}
}
