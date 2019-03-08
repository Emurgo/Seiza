import React from 'react'
import {compose} from 'redux'
import {withProps, withHandlers} from 'recompose'

import * as storage from '@/helpers/localStorage'
import * as urlUtils from '@/helpers/url'
import {withUrlManager, getStorageData} from './utils'

// TODO: dont allow adding more than 'n' pools

const STORAGE_KEY = 'selectedPools'

const DEFAULT_VALUE = []

// TODO: needed once we add proper flow
export const initialSelectedPoolsContext = {
  selectedPoolsContext: {
    selectedPools: DEFAULT_VALUE,
    addPool: null,
    removePool: null,
    _setSelectedPoolsStorageFromQuery: null,
    _selectedPoolsStorageToQuery: null,
  },
}

const mergeProps = (BaseComponent) => ({
  selectedPools,
  removePool,
  addPool,
  _setSelectedPoolsStorageFromQuery,
  _selectedPoolsStorageToQuery,
  ...restProps
}) => {
  return (
    <BaseComponent
      selectedPoolsContext={{
        addPool,
        removePool,
        selectedPools,
        _setSelectedPoolsStorageFromQuery,
        _selectedPoolsStorageToQuery,
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
    _setSelectedPoolsStorageFromQuery: ({setPools, getQueryParam}) => (query) => {
      setPools(getQueryParam(STORAGE_KEY, DEFAULT_VALUE))
    },
    _selectedPoolsStorageToQuery: () => () => {
      const selectedPools = getStorageData(STORAGE_KEY, DEFAULT_VALUE)
      return selectedPools.length ? urlUtils.objToQueryString({selectedPools}) : null
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
