// @flow
import React, {useContext} from 'react'

import {useManageSimpleContextValue} from './utils'

import type {ProviderProps} from './utils'

const STORAGE_KEY = 'sortBy'

export const SORT_BY_OPTIONS = {
  REVENUE: 'REVENUE',
  PERFORMANCE: 'PERFORMANCE',
  FULLNESS: 'FULLNESS',
  PLEDGE: 'PLEDGE',
  MARGINS: 'MARGINS',
  STAKE: 'STAKE',
  RANDOM: 'RANDOM',
}

const DEFAULT_VALUE = SORT_BY_OPTIONS.REVENUE

type ContextType = {
  sortBy: string,
  setSortBy: Function,
  _setSortByStorageFromQuery: Function,
  _sortByStorageToQuery: Function,
  _setSortByStorageToDefault: Function,
}

const Context = React.createContext<ContextType>({
  sortBy: STORAGE_KEY,
  setSortBy: null,
  _setSortByStorageFromQuery: null,
  _sortByStorageToQuery: null,
  _setSortByStorageToDefault: null,
})

export const SortByProvider = ({children, autoSync}: ProviderProps) => {
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
        sortBy: value,
        setSortBy: setValue,
        _setSortByStorageFromQuery: _setStorageFromQuery,
        _sortByStorageToQuery: _storageToQuery,
        _setSortByStorageToDefault: _setStorageToDefault,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useSortByContext = (): ContextType => useContext(Context)
