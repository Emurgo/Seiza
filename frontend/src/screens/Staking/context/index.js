import React from 'react'
import {compose} from 'redux'

import {
  selectedPoolsProvider,
  getSelectedPoolsConsumer,
  initialSelectedPoolsContext,
} from './selectedPools'

import {sortByProvider, getSortByConsumer, initialSortByContext} from './sortBy'

const Context = React.createContext({
  ...initialSelectedPoolsContext,
  ...initialSortByContext,
})

export const stakingContextProvider = (WrappedComponent) =>
  compose(
    selectedPoolsProvider,
    sortByProvider
  )(({selectedPoolsContext, sortByContext, ...props}) => (
    <Context.Provider
      value={{
        selectedPoolsContext,
        sortByContext,
      }}
    >
      <WrappedComponent {...props} />
    </Context.Provider>
  ))

export const withSyncListScreenWithUrl = (WrappedComponent) => (props) => (
  <Context.Consumer>
    {({
      selectedPoolsContext: {_syncSelectedPoolsWithUrl, _selectedPoolsStorageToUrl},
      sortByContext: {_syncSortByWithUrl, _sortByStorageToUrl},
    }) => {
      const getListScreenUrlQuery = () => {
        const selectedPoolsUrl = _selectedPoolsStorageToUrl()
        const sortByUrl = _sortByStorageToUrl()

        const nonEmptyUrls = [selectedPoolsUrl, sortByUrl].filter((url) => url)
        return nonEmptyUrls.length ? `?${nonEmptyUrls.join('&')}` : ''
      }

      const syncListScreenWithUrl = (query) => {
        _syncSelectedPoolsWithUrl(query)
        _syncSortByWithUrl(query)
      }

      return (
        <WrappedComponent
          {...props}
          syncListScreenWithUrl={syncListScreenWithUrl}
          getListScreenUrlQuery={getListScreenUrlQuery}
        />
      )
    }}
  </Context.Consumer>
)

export const withSelectedPoolsContext = getSelectedPoolsConsumer(Context)
export const withSortByContext = getSortByConsumer(Context)
