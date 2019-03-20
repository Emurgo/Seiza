// @flow

import * as React from 'react'

import * as urlUtils from '@/helpers/url'
import {SelectedPoolsProvider, useSelectedPoolsContext} from './selectedPools'
import {SortByProvider, useSortByContext} from './sortBy'
import {FiltersProvider, useShowFiltersContext} from './showFilters'
import {SearchTextProvider, useSearchTextContext} from './searchText'
import {PerformanceProvider, usePerformanceContext} from './performance'

import {useUrlManager} from './utils'

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
  const {_setSortByStorageFromQuery, _sortByStorageToQuery} = useSortByContext()
  const {_setPerformanceStorageFromQuery, _performanceStorageToQuery} = usePerformanceContext()
  const {_setSearchTextStorageFromQuery, _searchTextStorageToQuery} = useSearchTextContext()
  const {
    _setSelectedPoolsStorageFromQuery,
    _selectedPoolsStorageToQuery,
  } = useSelectedPoolsContext()
  const {_setShowFiltersStorageFromQuery, _showFiltersStorageToQuery} = useShowFiltersContext()

  const getScreenUrlQuery = () => {
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

  const setScreenStorageFromQuery = (query: string) => {
    _setSelectedPoolsStorageFromQuery(query)
    _setSortByStorageFromQuery(query)
    _setShowFiltersStorageFromQuery(query)
    _setSearchTextStorageFromQuery(query)
    _setPerformanceStorageFromQuery(query)
  }

  return {setScreenStorageFromQuery, getScreenUrlQuery}
}

export function useSetBasicScreenStorageFromQuery() {
  const {
    _setSelectedPoolsStorageFromQuery,
    _selectedPoolsStorageToQuery,
  } = useSelectedPoolsContext()

  const getScreenUrlQuery = () => {
    const selectedPoolsQuery = _selectedPoolsStorageToQuery()
    return urlUtils.joinQueryStrings([selectedPoolsQuery])
  }

  const setScreenStorageFromQuery = (query: string) => {
    _setSelectedPoolsStorageFromQuery(query)
  }

  return {setScreenStorageFromQuery, getScreenUrlQuery}
}

export function useResetUrlAndStorage() {
  const {setQuery} = useUrlManager()
  const {_setSortByStorageToDefault} = useSortByContext()
  const {_setPerformanceStorageToDefault} = usePerformanceContext()
  const {_setSearchTextStorageToDefault} = useSearchTextContext()
  const {_setShowFiltersStorageToDefault} = useShowFiltersContext()
  const {getScreenUrlQuery} = useSetListScreenStorageFromQuery()

  // Note: we do not reset "selected pools" intentionally
  // Note: we can not perform url replacement in separate `_reset` functions as
  // they have all closured initial urlQuery and would rewrite sooner rewritten urlQuery
  const resetUrlAndStorage = () => {
    _setPerformanceStorageToDefault()
    _setSortByStorageToDefault()
    _setSearchTextStorageToDefault()
    _setShowFiltersStorageToDefault()

    const query = getScreenUrlQuery()
    setQuery(query)
  }

  return resetUrlAndStorage
}
