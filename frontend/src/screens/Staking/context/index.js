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

const Context = React.createContext({
  ...initialSelectedPoolsContext,
  ...initialSortByContext,
  ...initialShowFiltersContext,
})

export const stakingContextProvider = (WrappedComponent) =>
  compose(
    selectedPoolsProvider,
    sortByProvider,
    showFiltersProvider
  )(({selectedPoolsContext, sortByContext, showFiltersContext, ...props}) => (
    <Context.Provider
      value={{
        selectedPoolsContext,
        sortByContext,
        showFiltersContext,
      }}
    >
      <WrappedComponent {...props} />
    </Context.Provider>
  ))

export const withSyncListScreenWithUrlQuery = (WrappedComponent) => (props) => (
  <Context.Consumer>
    {({
      selectedPoolsContext: {_syncSelectedPoolsWithQuery, _selectedPoolsStorageToQuery},
      sortByContext: {_syncSortByWithQuery, _sortByStorageToQuery},
      showFiltersContext: {_syncShowFiltersWithQuery, _showFiltersStorageToQuery},
    }) => {
      const getListScreenUrlQuery = () => {
        const selectedPoolsQuery = _selectedPoolsStorageToQuery()
        const sortByQuery = _sortByStorageToQuery()
        const showFiltersQuery = _showFiltersStorageToQuery()
        return urlUtils.joinQueryStrings([selectedPoolsQuery, sortByQuery, showFiltersQuery])
      }

      const syncListScreenWithUrlQuery = (query) => {
        _syncSelectedPoolsWithQuery(query)
        _syncSortByWithQuery(query)
        _syncShowFiltersWithQuery(query)
      }

      return (
        <WrappedComponent
          {...props}
          syncListScreenWithUrlQuery={syncListScreenWithUrlQuery}
          getListScreenUrlQuery={getListScreenUrlQuery}
        />
      )
    }}
  </Context.Consumer>
)

export const withSelectedPoolsContext = getSelectedPoolsConsumer(Context)
export const withSortByContext = getSortByConsumer(Context)
export const withShowFiltersContext = getShowFiltersConsumer(Context)
