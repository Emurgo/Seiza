// @flow

import React, {useContext} from 'react'

import {useManageSimpleContextValue} from './utils'

import type {ProviderProps} from './utils'

const STORAGE_KEY = 'searchText'
const DEFAULT_VALUE = ''

type ContextType = {
  searchTextContext: {
    searchText: string,
    setSearchText: Function,
    _setSearchTextStorageFromQuery: Function,
    _searchTextStorageToQuery: Function,
  },
}

const Context = React.createContext<ContextType>({
  searchTextContext: {
    searchText: DEFAULT_VALUE,
    setSearchText: null,
    _setSearchTextStorageFromQuery: null,
    _searchTextStorageToQuery: null,
  },
})

export const SearchTextProvider = ({children}: ProviderProps) => {
  const {value, setValue, _setStorageFromQuery, _storageToQuery} = useManageSimpleContextValue(
    STORAGE_KEY,
    DEFAULT_VALUE
  )
  return (
    <Context.Provider
      value={{
        searchTextContext: {
          searchText: value,
          setSearchText: setValue,
          _searchTextStorageToQuery: _storageToQuery,
          _setSearchTextStorageFromQuery: _setStorageFromQuery,
        },
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useSearchTextContext = (): ContextType => useContext(Context)
