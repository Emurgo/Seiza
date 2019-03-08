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

export const withSetListScreenStorageFromQuery = (WrappedComponent) => (props) => (
  <Context.Consumer>
    {({
      selectedPoolsContext: {_setSelectedPoolsStorageFromQuery, _selectedPoolsStorageToQuery},
      sortByContext: {_setSortByStorageFromQuery, _sortByStorageToQuery},
      showFiltersContext: {_setShowFiltersStorageFromQuery, _showFiltersStorageToQuery},
    }) => {
      const getListScreenUrlQuery = () => {
        const selectedPoolsQuery = _selectedPoolsStorageToQuery()
        const sortByQuery = _sortByStorageToQuery()
        const showFiltersQuery = _showFiltersStorageToQuery()
        return urlUtils.joinQueryStrings([selectedPoolsQuery, sortByQuery, showFiltersQuery])
      }

      const setListScreenStorageFromQuery = (query) => {
        _setSelectedPoolsStorageFromQuery(query)
        _setSortByStorageFromQuery(query)
        _setShowFiltersStorageFromQuery(query)
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
