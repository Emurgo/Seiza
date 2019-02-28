import React from 'react'
import {compose} from 'redux'
import {withState, withHandlers} from 'recompose'

import * as storage from '@/helpers/localStorage'

const Context = React.createContext({
  selectedPools: [],
  setPools: null,
  addPool: null,
  removePool: null,
})

// TODO: consider moving `JSON.stringify` to storage module
// TODO: dont allow adding more than 'n' pools
// TODO: find how to merge various context providers for `StakePool` screen

const STORAGE_KEY = 'selectedPools'

export const initSelectedPools = (WrappedComponent) =>
  compose(
    withState('selectedPools', 'setPools', JSON.parse(storage.getItem(STORAGE_KEY) || [])),
    withHandlers({
      setPools: ({setPools}) => (newPools) => {
        setPools(newPools)
        storage.setItem(STORAGE_KEY, JSON.stringify(newPools))
      },
    }),
    withHandlers({
      removePool: ({setPools, selectedPools}) => (poolHash) => {
        if (!selectedPools.includes(poolHash)) {
          throw new Error(`Could not remove pool ${poolHash}`)
        }
        const newSelectedPools = selectedPools.filter((_poolHash) => _poolHash !== poolHash)
        setPools(newSelectedPools)
      },
      addPool: ({setPools, selectedPools}) => (poolHash) => {
        if (selectedPools.includes(poolHash)) {
          throw new Error(`Pool ${poolHash} is already added.`)
        }
        const newSelectedPools = [...selectedPools, poolHash]
        setPools(newSelectedPools)
      },
    })
  )(({selectedPools, setPools, addPool, removePool, ...props}) => (
    <Context.Provider
      value={{
        setPools,
        selectedPools,
        addPool,
        removePool,
      }}
    >
      <WrappedComponent {...props} />
    </Context.Provider>
  ))

export const withSelectedPools = (WrappedComponent) => (props) => (
  <Context.Consumer>
    {({setPools, selectedPools, addPool, removePool}) => (
      <WrappedComponent
        {...props}
        setPools={setPools}
        selectedPools={selectedPools}
        addPool={addPool}
        removePool={removePool}
      />
    )}
  </Context.Consumer>
)
