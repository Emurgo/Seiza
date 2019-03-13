// @flow

import React, {useCallback, useContext} from 'react'

import {useManageSimpleContextValue} from './utils'

const STORAGE_KEY = 'showFilters'

// Note: undefined is used instead of 'false' intentionally
// check: https://www.npmjs.com/package/query-string
const DEFAULT_VALUE = undefined

type ContextType = {
  showFiltersContext: {
    showFilters: typeof undefined | true,
    toggleFilters: Function,
    _setShowFiltersStorageFromQuery: Function,
    _showFiltersStorageToQuery: Function,
  },
}

const Context = React.createContext<ContextType>({
  showFiltersContext: {
    showFilters: DEFAULT_VALUE,
    toggleFilters: null,
    _setShowFiltersStorageFromQuery: null,
    _showFiltersStorageToQuery: null,
  },
})

export const withFiltersProvider = <Props>(
  WrappedComponent: React$ComponentType<Props>
): React$ComponentType<Props> => (props) => {
    const {
      value: showFilters,
      setValue: _setShowFilters,
      _setStorageFromQuery: _setShowFiltersStorageFromQuery,
      _storageToQuery: _showFiltersStorageToQuery,
    } = useManageSimpleContextValue(STORAGE_KEY, DEFAULT_VALUE)

    const toggleFilters = useCallback(() => {
      const newValue = showFilters ? DEFAULT_VALUE : true
      _setShowFilters(newValue)
    }, [_setShowFilters, showFilters])

    return (
      <Context.Provider
        value={{
          showFiltersContext: {
            showFilters,
            toggleFilters,
            _setShowFiltersStorageFromQuery,
            _showFiltersStorageToQuery,
          },
        }}
      >
        <WrappedComponent {...props} />
      </Context.Provider>
    )
  }

export const useShowFiltersContext = (): ContextType => useContext(Context)
