import React from 'react'
import {compose} from 'redux'
import {withProps, withHandlers} from 'recompose'

import * as storage from '@/helpers/localStorage'
import * as urlUtils from '@/helpers/url'
import {withUrlManager, getStorageData} from './utils'

const STORAGE_KEY = 'searchBy'

const DEFAULT_VALUE = ''

// TODO: needed once we add proper flow
export const initialSearchByContext = {
  sortByContext: {
    searchBy: DEFAULT_VALUE,
    setSearchBy: null,
    _setSearchByStorageFromQuery: null,
    _searchByStorageToQuery: null,
  },
}

const mergeProps = (BaseComponent) => ({
  searchBy,
  setSearchBy,
  _setSearchByStorageFromQuery,
  _searchByStorageToQuery,
  ...restProps
}) => {
  return (
    <BaseComponent
      searchByContext={{
        searchBy,
        setSearchBy,
        _setSearchByStorageFromQuery,
        _searchByStorageToQuery,
      }}
      {...restProps}
    />
  )
}

export const searchByProvider = compose(
  withUrlManager,
  withProps((props) => ({
    searchBy: props.getQueryParam(STORAGE_KEY, DEFAULT_VALUE),
  })),
  withHandlers({
    setSearchBy: ({setQueryParam}) => (searchBy) => {
      storage.setItem(STORAGE_KEY, JSON.stringify(searchBy))
      setQueryParam(STORAGE_KEY, searchBy)
    },
  }),
  withHandlers({
    _setSearchByStorageFromQuery: ({setSearchBy, getQueryParam}) => (query) => {
      setSearchBy(getQueryParam(STORAGE_KEY, DEFAULT_VALUE))
    },
    _searchByStorageToQuery: () => () => {
      const searchBy = getStorageData(STORAGE_KEY, DEFAULT_VALUE)
      return urlUtils.objToQueryString({searchBy})
    },
  }),
  mergeProps
)

export const getSearchByConsumer = (Context) => (WrappedComponent) => (props) => (
  <Context.Consumer>
    {({searchByContext}) => <WrappedComponent {...props} searchByContext={searchByContext} />}
  </Context.Consumer>
)
