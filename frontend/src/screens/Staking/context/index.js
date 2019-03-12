import React from 'react'
import {compose} from 'redux'

import * as urlUtils from '@/helpers/url'

import {withSelectedPoolsProvider, withSelectedPoolsContext} from './selectedPools'
import {withSortByProvider, withSortByContext} from './sortBy'
import {withFiltersProvider, withShowFiltersContext} from './showFilters'
import {withSearchTextProvider, withSearchTextContext} from './searchText'
import {withPerformanceProvider, withPerformanceContext} from './performance'

// TODO: `searchText`, `sortBy` and `performance` are extremenly similar,
// create one common module for them (module to operate on a simple value)

export const stakingContextProvider = compose(
  withSelectedPoolsProvider,
  withSortByProvider,
  withFiltersProvider,
  withSearchTextProvider,
  withPerformanceProvider
)

export const withSetListScreenStorageFromQuery = compose(
  withSelectedPoolsContext,
  withSortByContext,
  withShowFiltersContext,
  withSearchTextContext,
  withPerformanceContext,
  (WrappedComponent) => ({
    selectedPoolsContext: {_setSelectedPoolsStorageFromQuery, _selectedPoolsStorageToQuery},
    sortByContext: {_setSortByStorageFromQuery, _sortByStorageToQuery},
    showFiltersContext: {_setShowFiltersStorageFromQuery, _showFiltersStorageToQuery},
    searchTextContext: {_setSearchTextStorageFromQuery, _searchTextStorageToQuery},
    performanceContext: {_setPerformanceStorageFromQuery, _performanceStorageToQuery},
    ...restProps
  }) => {
    const getListScreenUrlQuery = () => {
      const selectedPoolsQuery = _selectedPoolsStorageToQuery()
      const sortByQuery = _sortByStorageToQuery()
      const showFiltersQuery = _showFiltersStorageToQuery()
      const searchTextQuery = _searchTextStorageToQuery()
      const performanceQuery = _performanceStorageToQuery()
      return urlUtils.joinQueryStrings([
        selectedPoolsQuery,
        sortByQuery,
        showFiltersQuery,
        searchTextQuery,
        performanceQuery,
      ])
    }

    const setListScreenStorageFromQuery = (query) => {
      _setSelectedPoolsStorageFromQuery(query)
      _setSortByStorageFromQuery(query)
      _setShowFiltersStorageFromQuery(query)
      _setSearchTextStorageFromQuery(query)
      _setPerformanceStorageFromQuery(query)
    }

    return (
      <WrappedComponent
        {...restProps}
        setListScreenStorageFromQuery={setListScreenStorageFromQuery}
        getListScreenUrlQuery={getListScreenUrlQuery}
      />
    )
  }
)
