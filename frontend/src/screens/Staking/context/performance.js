import React from 'react'
import {compose} from 'redux'

import {withManageSimpleContextValue} from './utils'

const STORAGE_KEY = 'performance'
const DEFAULT_VALUE = [0, 100]

const Context = React.createContext({
  performanceContext: {
    performance: DEFAULT_VALUE,
    setPerformance: null,
    _setPerformanceStorageFromQuery: null,
    _performanceStorageToQuery: null,
  },
})

const toIntArray = (array) => array.map((v) => parseInt(v, 10))

export const withPerformanceProvider = compose(
  withManageSimpleContextValue(STORAGE_KEY, DEFAULT_VALUE, toIntArray),
  (WrappedComponent) => ({
    value: performance,
    setValue: setPerformance,
    _setStorageFromQuery: _setPerformanceStorageFromQuery,
    _storageToQuery: _performanceStorageToQuery,
    ...restProps
  }) => {
    return (
      <Context.Provider
        value={{
          performanceContext: {
            performance,
            setPerformance,
            _setPerformanceStorageFromQuery,
            _performanceStorageToQuery,
          },
        }}
      >
        <WrappedComponent {...restProps} />
      </Context.Provider>
    )
  }
)

export const withPerformanceContext = (WrappedComponent) => (props) => (
  <Context.Consumer>
    {({performanceContext}) => (
      <WrappedComponent {...props} performanceContext={performanceContext} />
    )}
  </Context.Consumer>
)
