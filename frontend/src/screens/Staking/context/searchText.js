import React from 'react'
import {compose} from 'redux'

import {withManageSimpleContextValue} from './utils'

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
  withManageSimpleContextValue(STORAGE_KEY, DEFAULT_VALUE),
  (WrappedComponent) => ({
    value: searchText,
    setValue: setSearchText,
    _storageToQuery: _searchTextStorageToQuery,
    _setStorageFromQuery: _setSearchTextStorageFromQuery,
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
