// @flow

import React, {useContext} from 'react'

import {useManageSimpleContextValue} from './utils'

const STORAGE_KEY = 'performance'
const DEFAULT_VALUE = [0, 100]

type ContextType = {
  performanceContext: {
    performance: Array<number>,
    setPerformance: Function,
    _setPerformanceStorageFromQuery: Function,
    _performanceStorageToQuery: Function,
  },
}

const Context = React.createContext<ContextType>({
  performanceContext: {
    performance: DEFAULT_VALUE,
    setPerformance: null,
    _setPerformanceStorageFromQuery: null,
    _performanceStorageToQuery: null,
  },
})

const toIntArray = (array: Array<string | number>): Array<number> =>
  array.map((v) => parseInt(v, 10))

export const withPerformanceProvider = <Props>(
  WrappedComponent: React$ComponentType<Props>
): React$ComponentType<Props> => (props) => {
    const {value, setValue, _setStorageFromQuery, _storageToQuery} = useManageSimpleContextValue(
      STORAGE_KEY,
      DEFAULT_VALUE,
      toIntArray
    )

    return (
      <Context.Provider
        value={{
          performanceContext: {
            performance: value,
            setPerformance: setValue,
            _setPerformanceStorageFromQuery: _setStorageFromQuery,
            _performanceStorageToQuery: _storageToQuery,
          },
        }}
      >
        <WrappedComponent {...props} />
      </Context.Provider>
    )
  }

export const usePerformanceContext = (): ContextType => useContext(Context)
