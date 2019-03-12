import React from 'react'
import {compose} from 'redux'
import {withProps, withHandlers} from 'recompose'

import * as storage from '@/helpers/localStorage'
import * as urlUtils from '@/helpers/url'
import {withUrlManager, getStorageData} from './utils'

// TODO: refactor (DRY) in next PR all similar context handlers at once

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
  withUrlManager,
  withProps((props) => ({
    performance: toIntArray(props.getQueryParam(STORAGE_KEY, DEFAULT_VALUE)),
  })),
  withHandlers({
    setPerformance: ({setQueryParam}) => (performance) => {
      storage.setItem(STORAGE_KEY, JSON.stringify(performance))
      setQueryParam(STORAGE_KEY, performance)
    },
  }),
  withHandlers({
    _setPerformanceStorageFromQuery: ({setPerformance, getQueryParam}) => (query) => {
      setPerformance(getQueryParam(STORAGE_KEY, DEFAULT_VALUE))
    },
    _performanceStorageToQuery: () => () => {
      const performance = getStorageData(STORAGE_KEY, DEFAULT_VALUE)
      return urlUtils.objToQueryString({performance})
    },
  }),
  (WrappedComponent) => ({
    performance,
    setPerformance,
    _setPerformanceStorageFromQuery,
    _performanceStorageToQuery,
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
