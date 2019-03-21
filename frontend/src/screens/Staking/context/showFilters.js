// @flow

import React, {useCallback, useContext} from 'react'

import {useManageSimpleContextValue} from './utils'

import type {ProviderProps} from './utils'

const STORAGE_KEY = 'showFilters'

// Note: undefined is used instead of 'false' intentionally
// check: https://www.npmjs.com/package/query-string
const DEFAULT_VALUE = undefined

type ContextType = {
  showFilters: typeof undefined | true,
  toggleFilters: Function,
  _setShowFiltersStorageFromQuery: Function,
  _showFiltersStorageToQuery: Function,
  _setShowFiltersStorageToDefault: Function,
}

const Context = React.createContext<ContextType>({
  showFilters: DEFAULT_VALUE,
  toggleFilters: null,
  _setShowFiltersStorageFromQuery: null,
  _showFiltersStorageToQuery: null,
  _setShowFiltersStorageToDefault: null,
})

export const FiltersProvider = ({children, autoSync}: ProviderProps) => {
  const {
    value: showFilters,
    setValue: _setShowFilters,
    _setStorageFromQuery: _setShowFiltersStorageFromQuery,
    _storageToQuery: _showFiltersStorageToQuery,
    _setStorageToDefault: _setShowFiltersStorageToDefault,
  } = useManageSimpleContextValue(autoSync, STORAGE_KEY, DEFAULT_VALUE)

  const toggleFilters = useCallback(() => {
    const newValue = showFilters ? DEFAULT_VALUE : true
    _setShowFilters(newValue)
  }, [_setShowFilters, showFilters])

  return (
    <Context.Provider
      value={{
        showFilters,
        toggleFilters,
        _setShowFiltersStorageFromQuery,
        _showFiltersStorageToQuery,
        _setShowFiltersStorageToDefault,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useShowFiltersContext = (): ContextType => useContext(Context)
