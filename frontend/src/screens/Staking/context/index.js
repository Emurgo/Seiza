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

// TODO: think if really want just one Provider for whole staking section or want to break it
// into multiple context providers as it is the way how we infact use them

// TODO: `searchText` and `sortBy` are extremenly similar, create one common module for them
// (module to operate on a simple value)

const Context = React.createContext({
  ...initialSelectedPoolsContext,
  ...initialSortByContext,
  ...initialShowFiltersContext,
  ...initialSearchTextContext,
})

export const stakingContextProvider = (WrappedComponent) =>
  compose(
    selectedPoolsProvider,
    sortByProvider,
    showFiltersProvider,
    searchTextProvider
  )(({selectedPoolsContext, sortByContext, showFiltersContext, searchTextContext, ...props}) => (
    <Context.Provider
      value={{
        selectedPoolsContext,
        sortByContext,
        showFiltersContext,
        searchTextContext,
      }}
    >
      <WrappedComponent {...props} />
    </Context.Provider>
  ))

export const withSetListScreenStorageFromQuery = (WrappedComponent) => (props) => (
  <Context.Consumer>
    {({
      selectedPoolsContext: {_setSelectedPoolsStorageFromQuery, _selectedPoolsStorageToQuery},
      sortByContext: {_setSortByStorageFromQuery, _sortByStorageToQuery},
      showFiltersContext: {_setShowFiltersStorageFromQuery, _showFiltersStorageToQuery},
      searchTextContext: {_setSearchTextStorageFromQuery, _searchTextStorageToQuery},
    }) => {
      const getListScreenUrlQuery = () => {
        const selectedPoolsQuery = _selectedPoolsStorageToQuery()
        const sortByQuery = _sortByStorageToQuery()
        const showFiltersQuery = _showFiltersStorageToQuery()
        const searchTextQuery = _searchTextStorageToQuery()
        return urlUtils.joinQueryStrings([
          selectedPoolsQuery,
          sortByQuery,
          showFiltersQuery,
          searchTextQuery,
        ])
      }

      const setListScreenStorageFromQuery = (query) => {
        _setSelectedPoolsStorageFromQuery(query)
        _setSortByStorageFromQuery(query)
        _setShowFiltersStorageFromQuery(query)
        _setSearchTextStorageFromQuery(query)
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
