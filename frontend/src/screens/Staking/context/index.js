import React from 'react'
import {compose} from 'redux'

import * as urlUtils from '@/helpers/url'

import {
  selectedPoolsProvider,
  getSelectedPoolsConsumer,
  initialSelectedPoolsContext,
} from './selectedPools'

import {sortByProvider, getSortByConsumer, initialSortByContext} from './sortBy'

import {showFiltersProvider, getShowFiltersConsumer, initialShowFiltersContext} from './showFilters'

import {searchTextProvider, getSearchTextConsumer, initialSearchTextContext} from './searchText'

import {performanceProvider, getPerformanceConsumer, initialPerformanceContext} from './performance'

// TODO: think if really want just one Provider for whole staking section or want to break it
// into multiple context providers as it is the way how we infact use them

// TODO: `searchText` and `sortBy` are extremenly similar, create one common module for them
// (module to operate on a simple value)

const Context = React.createContext({
  ...initialSelectedPoolsContext,
  ...initialSortByContext,
  ...initialShowFiltersContext,
  ...initialSearchTextContext,
  ...initialPerformanceContext,
})

export const stakingContextProvider = (WrappedComponent) =>
  compose(
    selectedPoolsProvider,
    sortByProvider,
    showFiltersProvider,
    searchTextProvider,
    performanceProvider
  )(
    ({
      selectedPoolsContext,
      sortByContext,
      showFiltersContext,
      searchTextContext,
      performanceContext,
      ...props
    }) => (
      <Context.Provider
        value={{
          selectedPoolsContext,
          sortByContext,
          showFiltersContext,
          searchTextContext,
          performanceContext,
        }}
      >
        <WrappedComponent {...props} />
      </Context.Provider>
    )
  )

export const withSetListScreenStorageFromQuery = (WrappedComponent) => (props) => (
  <Context.Consumer>
    {({
      selectedPoolsContext: {_setSelectedPoolsStorageFromQuery, _selectedPoolsStorageToQuery},
      sortByContext: {_setSortByStorageFromQuery, _sortByStorageToQuery},
      showFiltersContext: {_setShowFiltersStorageFromQuery, _showFiltersStorageToQuery},
      searchTextContext: {_setSearchTextStorageFromQuery, _searchTextStorageToQuery},
      performanceContext: {_setPerformanceStorageFromQuery, _performanceStorageToQuery},
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
          {...props}
          setListScreenStorageFromQuery={setListScreenStorageFromQuery}
          getListScreenUrlQuery={getListScreenUrlQuery}
        />
      )
    }}
  </Context.Consumer>
)

export const withSelectedPoolsContext = getSelectedPoolsConsumer(Context)
export const withSortByContext = getSortByConsumer(Context)
export const withShowFiltersContext = getShowFiltersConsumer(Context)
export const withSearchTextContext = getSearchTextConsumer(Context)
export const withPerformanceContext = getPerformanceConsumer(Context)
