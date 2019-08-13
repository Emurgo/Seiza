// @flow

import * as React from 'react'

import useReactRouter from 'use-react-router'

import * as urlUtils from '@/helpers/url'

export const useUrlManager = () => {
  const {history} = useReactRouter()

  const setQueryParam = React.useCallback(
    (key: string, value: any) => {
      history.replace({
        // TODO: investigate
        // in components, where multiple useUrlManager hooks are used,
        // location.search from useReactRouter is sometimes empty here, for an unknown reason,
        // thus not reflecting the latest URL state
        // and resulting in overwriting the URL changed by other useUrlManager hooks
        search: urlUtils.replaceQueryParam(
          process.browser ? window.location.search : history.location.search,
          key,
          value
        ),
      })
    },
    [history]
  )

  const getQueryParam = React.useCallback(
    (paramKey: string, query?: string): any => {
      const parsed = urlUtils.parse(
        query || process.browser ? window.location.search : history.location.search
      )
      return parsed[paramKey]
    },
    [history.location.search]
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
