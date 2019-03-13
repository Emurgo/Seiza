// @flow

import * as React from 'react'

import * as urlUtils from '@/helpers/url'
import {SelectedPoolsProvider, useSelectedPoolsContext} from './selectedPools'
import {SortByProvider, useSortByContext} from './sortBy'
import {FiltersProvider, useShowFiltersContext} from './showFilters'
import {SearchTextProvider, useSearchTextContext} from './searchText'
import {PerformanceProvider, usePerformanceContext} from './performance'

// TODO: once we have only hooks, dont wrap fields inside `somethingContext` object (next PR)

type ProviderProps = {|
  children: React.Node,
|}

export const StakingContextProvider = ({children}: ProviderProps) => (
  <SelectedPoolsProvider>
    <SortByProvider>
      <FiltersProvider>
        <SearchTextProvider>
          <PerformanceProvider>{children}</PerformanceProvider>
        </SearchTextProvider>
      </FiltersProvider>
    </SortByProvider>
  </SelectedPoolsProvider>
)

export function useSetListScreenStorageFromQuery() {
  const {
    sortByContext: {_setSortByStorageFromQuery, _sortByStorageToQuery},
  } = useSortByContext()
  const {
    performanceContext: {_setPerformanceStorageFromQuery, _performanceStorageToQuery},
  } = usePerformanceContext()
  const {
    searchTextContext: {_setSearchTextStorageFromQuery, _searchTextStorageToQuery},
  } = useSearchTextContext()
  const {
    selectedPoolsContext: {_setSelectedPoolsStorageFromQuery, _selectedPoolsStorageToQuery},
  } = useSelectedPoolsContext()
  const {
    showFiltersContext: {_setShowFiltersStorageFromQuery, _showFiltersStorageToQuery},
  } = useShowFiltersContext()

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

  const setListScreenStorageFromQuery = (query: string) => {
    _setSelectedPoolsStorageFromQuery(query)
    _setSortByStorageFromQuery(query)
    _setShowFiltersStorageFromQuery(query)
    _setSearchTextStorageFromQuery(query)
    _setPerformanceStorageFromQuery(query)
  }

  return {setListScreenStorageFromQuery, getListScreenUrlQuery}
}
