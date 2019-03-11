import React from 'react'
import {compose} from 'redux'
import {withProps, withHandlers} from 'recompose'

import * as storage from '@/helpers/localStorage'
import * as urlUtils from '@/helpers/url'
import {withUrlManager, getStorageData} from './utils'

const STORAGE_KEY = 'searchText'

const DEFAULT_VALUE = ''

// TODO: needed once we add proper flow
export const initialSearchTextContext = {
  sortByContext: {
    searchText: DEFAULT_VALUE,
    setSearchText: null,
    _setSearchTextStorageFromQuery: null,
    _searchTextStorageToQuery: null,
  },
}

const mergeProps = (BaseComponent) => ({
  searchText,
  setSearchText,
  _setSearchTextStorageFromQuery,
  _searchTextStorageToQuery,
  ...restProps
}) => {
  return (
    <BaseComponent
      searchTextContext={{
        searchText,
        setSearchText,
        _setSearchTextStorageFromQuery,
        _searchTextStorageToQuery,
      }}
      {...restProps}
    />
  )
}

export const searchTextProvider = compose(
  withUrlManager,
  withProps((props) => ({
    searchText: props.getQueryParam(STORAGE_KEY, DEFAULT_VALUE),
  })),
  withHandlers({
    setSearchText: ({setQueryParam}) => (searchText) => {
      storage.setItem(STORAGE_KEY, JSON.stringify(searchText))
      setQueryParam(STORAGE_KEY, searchText)
    },
  }),
  withHandlers({
    _setSearchTextStorageFromQuery: ({setSearchText, getQueryParam}) => (query) => {
      setSearchText(getQueryParam(STORAGE_KEY, DEFAULT_VALUE))
    },
    _searchTextStorageToQuery: () => () => {
      const searchText = getStorageData(STORAGE_KEY, DEFAULT_VALUE)
      return urlUtils.objToQueryString({searchText})
    },
  }),
  mergeProps
)

export const getSearchTextConsumer = (Context) => (WrappedComponent) => (props) => (
  <Context.Consumer>
    {({searchTextContext}) => <WrappedComponent {...props} searchTextContext={searchTextContext} />}
  </Context.Consumer>
)
