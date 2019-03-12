import React from 'react'
import {compose} from 'redux'
import {withProps, withHandlers} from 'recompose'

import * as storage from '@/helpers/localStorage'
import * as urlUtils from '@/helpers/url'
import {withUrlManager, getStorageData} from './utils'

const STORAGE_KEY = 'searchText'
const DEFAULT_VALUE = ''

const Context = React.createContext({
  searchTextContext: {
    searchText: DEFAULT_VALUE,
    setSearchText: null,
    _setSearchTextStorageFromQuery: null,
    _searchTextStorageToQuery: null,
  },
})

export const withSearchTextProvider = compose(
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
  (WrappedComponent) => ({
    searchText,
    setSearchText,
    _searchTextStorageToQuery,
    _setSearchTextStorageFromQuery,
    ...restProps
  }) => {
    return (
      <Context.Provider
        value={{
          searchTextContext: {
            searchText,
            setSearchText,
            _setSearchTextStorageFromQuery,
            _searchTextStorageToQuery,
          },
        }}
      >
        <WrappedComponent {...restProps} />
      </Context.Provider>
    )
  }
)

export const withSearchTextContext = (WrappedComponent) => (props) => (
  <Context.Consumer>
    {({searchTextContext}) => <WrappedComponent {...props} searchTextContext={searchTextContext} />}
  </Context.Consumer>
)
