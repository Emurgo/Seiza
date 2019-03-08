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

import {searchByProvider, getSearchByConsumer, initialSearchByContext} from './searchBy'

// TODO: think if really want just one Provider for whole staking section or want to break it
// into multiple context providers as it is the way how we infact use them

// TODO: `searchBy` and `sortBy` are extremenly similar, create one common module for them
// (module to operate on a simple value)

const Context = React.createContext({
  ...initialSelectedPoolsContext,
  ...initialSortByContext,
  ...initialShowFiltersContext,
  ...initialSearchByContext,
})

export const stakingContextProvider = (WrappedComponent) =>
  compose(
    selectedPoolsProvider,
    sortByProvider,
    showFiltersProvider,
    searchByProvider
  )(({selectedPoolsContext, sortByContext, showFiltersContext, searchByContext, ...props}) => (
    <Context.Provider
      value={{
        selectedPoolsContext,
        sortByContext,
        showFiltersContext,
        searchByContext,
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
      searchByContext: {_setSearchByStorageFromQuery, _searchByStorageToQuery},
    }) => {
      const getListScreenUrlQuery = () => {
        const selectedPoolsQuery = _selectedPoolsStorageToQuery()
        const sortByQuery = _sortByStorageToQuery()
        const showFiltersQuery = _showFiltersStorageToQuery()
        const searchByQuery = _searchByStorageToQuery()
        return urlUtils.joinQueryStrings([
          selectedPoolsQuery,
          sortByQuery,
          showFiltersQuery,
          searchByQuery,
        ])
      }

      const setListScreenStorageFromQuery = (query) => {
        _setSelectedPoolsStorageFromQuery(query)
        _setSortByStorageFromQuery(query)
        _setShowFiltersStorageFromQuery(query)
        _setSearchByStorageFromQuery(query)
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
export const withSearchByContext = getSearchByConsumer(Context)
