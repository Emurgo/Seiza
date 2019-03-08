import React from 'react'
import {compose} from 'redux'
import {withProps, withHandlers} from 'recompose'

import * as storage from '@/helpers/localStorage'
import * as urlUtils from '@/helpers/url'
import {withUrlManager, getStorageData} from './utils'

const STORAGE_KEY = 'showFilters'

// Note: undefined is used instead of 'false' intentionally
// check: https://www.npmjs.com/package/query-string
const DEFAULT_VALUE = undefined

// TODO: needed once we add proper flow
export const initialShowFiltersContext = {
  showFiltersContext: {
    showFilters: DEFAULT_VALUE,
    toggleFilters: null,
    _syncShowFiltersWithQuery: null,
    _showFiltersStorageToQuery: null,
  },
}

const mergeProps = (BaseComponent) => ({
  showFilters,
  toggleFilters,
  _syncShowFiltersWithQuery,
  _showFiltersStorageToQuery,
  _setShowFilters,
  ...restProps
}) => {
  return (
    <BaseComponent
      showFiltersContext={{
        showFilters,
        toggleFilters,
        _syncShowFiltersWithQuery,
        _showFiltersStorageToQuery,
      }}
      {...restProps}
    />
  )
}

export const showFiltersProvider = compose(
  withUrlManager,
  withProps((props) => ({
    showFilters: props.getQueryParam(STORAGE_KEY, DEFAULT_VALUE),
  })),
  withHandlers({
    _setShowFilters: ({setQueryParam}) => (newValue) => {
      storage.setItem(STORAGE_KEY, JSON.stringify(newValue))
      setQueryParam(STORAGE_KEY, newValue)
    },
  }),
  withHandlers({
    toggleFilters: ({_setShowFilters, showFilters}) => () => {
      const newValue = showFilters ? DEFAULT_VALUE : true
      _setShowFilters(newValue)
    },
  }),
  withHandlers({
    _syncShowFiltersWithQuery: ({_setShowFilters, getQueryParam}) => (query) => {
      _setShowFilters(getQueryParam(STORAGE_KEY, DEFAULT_VALUE))
    },
    _showFiltersStorageToQuery: () => () => {
      const showFilters = getStorageData(STORAGE_KEY, DEFAULT_VALUE)
      return urlUtils.objToQueryString({showFilters})
    },
  }),
  mergeProps
)

export const getShowFiltersConsumer = (Context) => (WrappedComponent) => (props) => (
  <Context.Consumer>
    {({showFiltersContext}) => (
      <WrappedComponent {...props} showFiltersContext={showFiltersContext} />
    )}
  </Context.Consumer>
)
