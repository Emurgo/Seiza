import React from 'react'
import {compose} from 'redux'
import {withProps, withHandlers} from 'recompose'

import * as storage from '@/helpers/localStorage'
import * as urlUtils from '@/helpers/url'
import {withUrlManager, getStorageData} from './utils'

const STORAGE_KEY = 'sortBy'

export const SORT_BY_OPTIONS = {
  REVENUE: 'REVENUE',
  PERFORMANCE: 'PERFORMANCE',
  FULLNESS: 'FULLNESS',
  PLEDGE: 'PLEDGE',
  MARGINS: 'MARGINS',
  STAKE: 'STAKE',
}

const DEFAULT_VALUE = SORT_BY_OPTIONS.REVENUE

// TODO: needed once we add proper flow
export const initialSortByContext = {
  sortByContext: {
    sortBy: DEFAULT_VALUE,
    setSortBy: null,
    _setSortByStorageFromQuery: null,
    _sortByStorageToQuery: null,
  },
}

const mergeProps = (BaseComponent) => ({
  sortBy,
  setSortBy,
  _setSortByStorageFromQuery,
  _sortByStorageToQuery,
  ...restProps
}) => {
  return (
    <BaseComponent
      sortByContext={{
        sortBy,
        setSortBy,
        _setSortByStorageFromQuery,
        _sortByStorageToQuery,
      }}
      {...restProps}
    />
  )
}

export const sortByProvider = compose(
  withUrlManager,
  withProps((props) => ({
    sortBy: props.getQueryParam(STORAGE_KEY, DEFAULT_VALUE),
  })),
  withHandlers({
    setSortBy: ({setQueryParam}) => (sortBy) => {
      storage.setItem(STORAGE_KEY, JSON.stringify(sortBy))
      setQueryParam(STORAGE_KEY, sortBy)
    },
  }),
  withHandlers({
    _setSortByStorageFromQuery: ({setSortBy, getQueryParam}) => (query) => {
      setSortBy(getQueryParam(STORAGE_KEY, DEFAULT_VALUE))
    },
    _sortByStorageToQuery: () => () => {
      const sortBy = getStorageData(STORAGE_KEY, DEFAULT_VALUE)
      return urlUtils.objToQueryString({sortBy})
    },
  }),
  mergeProps
)

export const getSortByConsumer = (Context) => (WrappedComponent) => (props) => (
  <Context.Consumer>
    {({sortByContext}) => <WrappedComponent {...props} sortByContext={sortByContext} />}
  </Context.Consumer>
)
