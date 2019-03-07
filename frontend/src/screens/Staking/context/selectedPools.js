import React from 'react'
import {compose} from 'redux'
import {withProps, withHandlers} from 'recompose'

import * as storage from '@/helpers/localStorage'

import {withUrlManager, objToQueryString, getStorageData} from './utils'

// TODO: dont allow adding more than 'n' pools

const STORAGE_KEY = 'selectedPools'

const DEFAULT_VALUE = []

export const initialSelectedPoolsContext = {
  selectedPoolsContext: {
    selectedPools: DEFAULT_VALUE,
    addPool: null,
    removePool: null,
    syncSelectedPoolsWithUrl: null,
    selectedPoolsStorageToUrl: null,
  },
}

const mergeProps = (BaseComponent) => ({
  selectedPools,
  removePool,
  addPool,
  _syncSelectedPoolsWithUrl,
  _selectedPoolsStorageToUrl,
  ...restProps
}) => {
  return (
    <BaseComponent
      selectedPoolsContext={{
        addPool,
        removePool,
        selectedPools,
        _syncSelectedPoolsWithUrl,
        _selectedPoolsStorageToUrl,
      }}
      {...restProps}
    />
  )
}

export const selectedPoolsProvider = compose(
  withUrlManager,
  withProps((props) => ({
    selectedPools: props.getQueryParam(STORAGE_KEY, DEFAULT_VALUE),
  })),
  withHandlers({
    setPools: ({setQueryParam}) => (newPools) => {
      storage.setItem(STORAGE_KEY, JSON.stringify(newPools))
      setQueryParam(STORAGE_KEY, newPools)
    },
  }),
  withHandlers({
    removePool: ({selectedPools, setPools}) => (poolHash) => {
      if (!selectedPools.includes(poolHash)) {
        throw new Error(`Could not remove pool ${poolHash}`)
      }
      const newSelectedPools = selectedPools.filter((_poolHash) => _poolHash !== poolHash)
      setPools(newSelectedPools)
    },
    addPool: ({selectedPools, setPools}) => (poolHash) => {
      if (selectedPools.includes(poolHash)) {
        throw new Error(`Pool ${poolHash} is already added.`)
      }
      const newSelectedPools = [...selectedPools, poolHash]
      setPools(newSelectedPools)
    },
    _syncSelectedPoolsWithUrl: ({setPools, getQueryParam}) => (query) => {
      setPools(getQueryParam(STORAGE_KEY, DEFAULT_VALUE))
    },
    _selectedPoolsStorageToUrl: () => () => {
      const selectedPools = getStorageData(STORAGE_KEY, DEFAULT_VALUE)
      return selectedPools.length ? objToQueryString({selectedPools}) : null
    },
  }),
  mergeProps
)

export const getSelectedPoolsConsumer = (Context) => (WrappedComponent) => (props) => (
  <Context.Consumer>
    {({selectedPoolsContext}) => (
      <WrappedComponent {...props} selectedPoolsContext={selectedPoolsContext} />
    )}
  </Context.Consumer>
)
