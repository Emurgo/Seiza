// @flow

import React, {useCallback, useContext} from 'react'

import * as storage from '@/helpers/localStorage'
import * as urlUtils from '@/helpers/url'
import {useUrlManager, getStorageData} from './utils'

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

export const withSelectedPoolsProvider = <Props>(
  WrappedComponent: React$ComponentType<Props>
): React$ComponentType<Props> => (props) => {
    const {setQueryParam, getQueryParam} = useUrlManager()

    const selectedPools = getQueryParam(STORAGE_KEY, DEFAULT_VALUE)

    const setPools = useCallback(
      (newPools) => {
        storage.setItem(STORAGE_KEY, JSON.stringify(newPools))
        setQueryParam(STORAGE_KEY, newPools)
      },
      [setQueryParam]
    )

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

    const _setSelectedPoolsStorageFromQuery = useCallback(
      () => setPools(getQueryParam(STORAGE_KEY, DEFAULT_VALUE)),
      [setPools, getQueryParam]
    )

    const _selectedPoolsStorageToQuery = useCallback(() => {
      const selectedPools = getStorageData(STORAGE_KEY, DEFAULT_VALUE)
      return selectedPools.length ? urlUtils.objToQueryString({selectedPools}) : null
    })

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
        <WrappedComponent {...props} />
      </Context.Provider>
    )
  }

export const useSelectedPoolsContext = (): ContextType => useContext(Context)
