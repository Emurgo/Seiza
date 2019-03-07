import React from 'react'
import {compose} from 'redux'
import {withProps, withHandlers} from 'recompose'

import * as storage from '@/helpers/localStorage'

import {withUrlManager, objToQueryString, getStorageData} from './utils'

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

export const initialSortByContext = {
  sortByContext: {
    sortBy: DEFAULT_VALUE,
  },
}

const mergeProps = (BaseComponent) => ({
  sortBy,
  setSortBy,
  _syncSortByWithUrl,
  _sortByStorageToUrl,
  ...restProps
}) => {
  return (
    <BaseComponent
      sortByContext={{
        sortBy,
        setSortBy,
        _syncSortByWithUrl,
        _sortByStorageToUrl,
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
    _syncSortByWithUrl: ({setSortBy, getQueryParam}) => (query) => {
      setSortBy(getQueryParam(STORAGE_KEY, DEFAULT_VALUE))
    },
    _sortByStorageToUrl: () => () => {
      const sortBy = getStorageData(STORAGE_KEY, DEFAULT_VALUE)
      return objToQueryString({sortBy})
    },
  }),
  mergeProps
)

export const getSortByConsumer = (Context) => (WrappedComponent) => (props) => (
  <Context.Consumer>
    {({sortByContext}) => <WrappedComponent {...props} sortByContext={sortByContext} />}
  </Context.Consumer>
)
