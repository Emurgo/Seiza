import {compose} from 'redux'

import * as urlUtils from '@/helpers/url'

import {withSelectedPoolsProvider, useSelectedPoolsContext} from './selectedPools'
import {withSortByProvider, useSortByContext} from './sortBy'
import {withFiltersProvider, useShowFiltersContext} from './showFilters'
import {withSearchTextProvider, useSearchTextContext} from './searchText'
import {withPerformanceProvider, usePerformanceContext} from './performance'

// TODO: once we have only hooks, dont wrap fields inside `somethingContext` object

// TODO: consider getting rid of `compose` and combine all providers in single component
export const stakingContextProvider = compose(
  withSelectedPoolsProvider,
  withSortByProvider,
  withFiltersProvider,
  withSearchTextProvider,
  withPerformanceProvider
)

export const useSetListScreenStorageFromQuery = () => {
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

  const setListScreenStorageFromQuery = (query) => {
    _setSelectedPoolsStorageFromQuery(query)
    _setSortByStorageFromQuery(query)
    _setShowFiltersStorageFromQuery(query)
    _setSearchTextStorageFromQuery(query)
    _setPerformanceStorageFromQuery(query)
  }

  return {getListScreenUrlQuery, setListScreenStorageFromQuery}
}
