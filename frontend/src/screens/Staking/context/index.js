import React from 'react'
import {compose} from 'redux'

import * as urlUtils from '@/helpers/url'

import {withSelectedPoolsProvider, withSelectedPoolsContext} from './selectedPools'
import {withSortByProvider, useSortByContext} from './sortBy'
import {withFiltersProvider, withShowFiltersContext} from './showFilters'
import {withSearchTextProvider, withSearchTextContext} from './searchText'
import {withPerformanceProvider, withPerformanceContext} from './performance'

// TODO: consider continuous rewriting to hooks for better flow coverage

export const stakingContextProvider = compose(
  withSelectedPoolsProvider,
  withSortByProvider,
  withFiltersProvider,
  withSearchTextProvider,
  withPerformanceProvider
)

export const withSetListScreenStorageFromQuery = compose(
  withSelectedPoolsContext,
  withShowFiltersContext,
  withSearchTextContext,
  withPerformanceContext,
  (WrappedComponent) => ({
    selectedPoolsContext: {_setSelectedPoolsStorageFromQuery, _selectedPoolsStorageToQuery},

    showFiltersContext: {_setShowFiltersStorageFromQuery, _showFiltersStorageToQuery},
    searchTextContext: {_setSearchTextStorageFromQuery, _searchTextStorageToQuery},
    performanceContext: {_setPerformanceStorageFromQuery, _performanceStorageToQuery},
    ...restProps
  }) => {
    const {
      sortByContext: {_setSortByStorageFromQuery, _sortByStorageToQuery},
    } = useSortByContext()
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
