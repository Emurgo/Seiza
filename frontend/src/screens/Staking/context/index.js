import React from 'react'
import {compose} from 'redux'

import {
  selectedPoolsProvider,
  getSelectedPoolsConsumer,
  initialSelectedPoolsContext,
} from './selectedPools'

const Context = React.createContext({
  ...initialSelectedPoolsContext,
})

export const stakingContextProvider = (WrappedComponent) =>
  compose(selectedPoolsProvider)(({selectedPoolsContext, ...props}) => (
    <Context.Provider
      value={{
        selectedPoolsContext,
      }}
    >
      <WrappedComponent {...props} />
    </Context.Provider>
  ))

export const withSyncListScreenWithUrl = (WrappedComponent) => (props) => (
  <Context.Consumer>
    {({selectedPoolsContext: {_syncSelectedPoolsWithUrl, _selectedPoolsStorageToUrl}}) => {
      const getListScreenUrlQuery = () => {
        const selectedPoolsUrl = _selectedPoolsStorageToUrl()
        return selectedPoolsUrl ? `?${selectedPoolsUrl}` : ''
      }

      const syncListScreenWithUrl = (query) => {
        _syncSelectedPoolsWithUrl(query)
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
