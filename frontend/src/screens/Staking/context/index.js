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

export const withSelectedPoolsContext = getSelectedPoolsConsumer(Context)
