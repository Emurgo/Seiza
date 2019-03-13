// @flow

import React, {useCallback, useContext} from 'react'

import {useManageSimpleContextValue} from './utils'

import type {ProviderProps} from './utils'

// TODO: dont allow adding more than 'n' pools

const STORAGE_KEY = 'selectedPools'
const DEFAULT_VALUE = []

type ContextType = {
  selectedPoolsContext: {
    selectedPools: Array<string>,
    addPool: Function,
    removePool: Function,
    setPools: Function,
    _setSelectedPoolsStorageFromQuery: Function,
    _selectedPoolsStorageToQuery: Function,
  },
}

const Context = React.createContext<ContextType>({
  selectedPoolsContext: {
    selectedPools: DEFAULT_VALUE,
    addPool: null,
    removePool: null,
    setPools: null,
    _setSelectedPoolsStorageFromQuery: null,
    _selectedPoolsStorageToQuery: null,
  },
})

export const SelectedPoolsProvider = ({children}: ProviderProps) => {
  const {
    value: selectedPools,
    setValue: setPools,
    _setStorageFromQuery: _setSelectedPoolsStorageFromQuery,
    _storageToQuery: _selectedPoolsStorageToQuery,
  } = useManageSimpleContextValue(STORAGE_KEY, DEFAULT_VALUE)

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
      const newSelectedPools = [...selectedPools, poolHash]
      setPools(newSelectedPools)
    },
    [selectedPools, setPools]
  )

  return (
    <Context.Provider
      value={{
        selectedPoolsContext: {
          selectedPools,
          addPool,
          removePool,
          setPools,
          _setSelectedPoolsStorageFromQuery,
          _selectedPoolsStorageToQuery,
        },
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useSelectedPoolsContext = (): ContextType => useContext(Context)
