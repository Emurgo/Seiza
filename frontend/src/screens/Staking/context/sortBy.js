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
}

const DEFAULT_VALUE = SORT_BY_OPTIONS.REVENUE

type ContextType = {
  sortByContext: {
    sortBy: string,
    setSortBy: Function,
    _setSortByStorageFromQuery: Function,
    _sortByStorageToQuery: Function,
  },
}

const Context = React.createContext<ContextType>({
  sortByContext: {
    sortBy: STORAGE_KEY,
    setSortBy: null,
    _setSortByStorageFromQuery: null,
    _sortByStorageToQuery: null,
  },
})

export const SortByProvider = ({children}: ProviderProps) => {
  const {value, setValue, _setStorageFromQuery, _storageToQuery} = useManageSimpleContextValue(
    STORAGE_KEY,
    DEFAULT_VALUE
  )
  return (
    <Context.Provider
      value={{
        sortByContext: {
          sortBy: value,
          setSortBy: setValue,
          _setSortByStorageFromQuery: _setStorageFromQuery,
          _sortByStorageToQuery: _storageToQuery,
        },
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useSortByContext = (): ContextType => useContext(Context)
