// @flow

import React, {useContext} from 'react'

import {useManageSimpleContextValue} from './utils'

import type {ProviderProps} from './utils'

const STORAGE_KEY = 'performance'
const DEFAULT_VALUE = [0, 100]

type ContextType = {
  performance: Array<number>,
  setPerformance: Function,
  _setPerformanceStorageFromQuery: Function,
  _performanceStorageToQuery: Function,
  _setPerformanceStorageToDefault: Function,
}

const Context = React.createContext<ContextType>({
  performance: DEFAULT_VALUE,
  setPerformance: null,
  _setPerformanceStorageFromQuery: null,
  _performanceStorageToQuery: null,
  _setPerformanceStorageToDefault: null,
})

const toIntArray = (array: Array<string | number>): Array<number> =>
  array.map((v) => parseInt(v, 10))

export const PerformanceProvider = ({children, autoSync}: ProviderProps) => {
  const {
    value,
    setValue,
    _setStorageFromQuery,
    _storageToQuery,
    _setStorageToDefault,
  } = useManageSimpleContextValue(autoSync, STORAGE_KEY, DEFAULT_VALUE, toIntArray)

  return (
    <Context.Provider
      value={{
        performance: value,
        setPerformance: setValue,
        _setPerformanceStorageFromQuery: _setStorageFromQuery,
        _performanceStorageToQuery: _storageToQuery,
        _setPerformanceStorageToDefault: _setStorageToDefault,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const usePerformanceContext = (): ContextType => useContext(Context)
