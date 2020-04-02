// @flow

import React, {useCallback, useContext} from 'react'

import {useManageSimpleContextValue} from './utils'

import type {ProviderProps} from './utils'

const STORAGE_KEY = 'selectedPools'
const DEFAULT_VALUE = []

const MAX_POOLS_SELECTED = 1

type ContextType = {
  selectedPools: Array<string>,
  addPool: Function,
  removePool: Function,
  setPools: Function,
  isListFull: boolean,
  _setSelectedPoolsStorageFromQuery: Function,
  _selectedPoolsStorageToQuery: Function,
  _setSelectedPoolsStorageToDefault: Function,
}

const Context = React.createContext<ContextType>({
  selectedPools: DEFAULT_VALUE,
  addPool: null,
  removePool: null,
  setPools: null,
  isListFull: false,
  _setSelectedPoolsStorageFromQuery: null,
  _selectedPoolsStorageToQuery: null,
  _setSelectedPoolsStorageToDefault: null,
})

export const SelectedPoolsProvider = ({children, autoSync}: ProviderProps) => {
  const {
    value: selectedPools,
    setValue: setPools,
    _setStorageFromQuery: _setSelectedPoolsStorageFromQuery,
    _storageToQuery: _selectedPoolsStorageToQuery,
    _setStorageToDefault: _setSelectedPoolsStorageToDefault,
  } = useManageSimpleContextValue(autoSync, STORAGE_KEY, DEFAULT_VALUE)

  const isListFull = selectedPools.length >= MAX_POOLS_SELECTED

  const removePool = useCallback(
    (poolHash) => {
      if (!selectedPools.includes(poolHash)) {
        throw new Error(`Could not remove pool ${poolHash}`)
      }
      const newSelectedPools = selectedPools.filter((_poolHash) => _poolHash !== poolHash)
      setPools(newSelectedPools)
    },
    [selectedPools, setPools]
  )

  const addPool = useCallback(
    (poolHash) => {
      if (selectedPools.includes(poolHash)) {
        throw new Error(`Pool ${poolHash} is already added.`)
      }
      if (isListFull) {
        return
      }
      const newSelectedPools = [...selectedPools, poolHash]
      setPools(newSelectedPools)
    },
    [selectedPools, setPools, isListFull]
  )

  return (
    <Context.Provider
      value={{
        selectedPools,
        addPool,
        removePool,
        setPools,
        isListFull,
        _setSelectedPoolsStorageFromQuery,
        _selectedPoolsStorageToQuery,
        _setSelectedPoolsStorageToDefault,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useSelectedPoolsContext = (): ContextType => useContext(Context)
