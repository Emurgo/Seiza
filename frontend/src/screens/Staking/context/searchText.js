// @flow

import React, {useContext} from 'react'

import {useManageSimpleContextValue} from './utils'

import type {ProviderProps} from './utils'

const STORAGE_KEY = 'searchText'
const DEFAULT_VALUE = ''

type ContextType = {
  searchText: string,
  setSearchText: Function,
  _setSearchTextStorageFromQuery: Function,
  _searchTextStorageToQuery: Function,
  _setSearchTextStorageToDefault: Function,
}

const Context = React.createContext<ContextType>({
  searchText: DEFAULT_VALUE,
  setSearchText: null,
  _setSearchTextStorageFromQuery: null,
  _searchTextStorageToQuery: null,
  _setSearchTextStorageToDefault: null,
})

export const SearchTextProvider = ({children, autoSync}: ProviderProps) => {
  const {
    value,
    setValue,
    _setStorageFromQuery,
    _storageToQuery,
    _setStorageToDefault,
  } = useManageSimpleContextValue(autoSync, STORAGE_KEY, DEFAULT_VALUE)
  return (
    <Context.Provider
      value={{
        searchText: value,
        setSearchText: setValue,
        _searchTextStorageToQuery: _storageToQuery,
        _setSearchTextStorageFromQuery: _setStorageFromQuery,
        _setSearchTextStorageToDefault: _setStorageToDefault,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useSearchTextContext = (): ContextType => useContext(Context)
