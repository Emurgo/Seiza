// @flow
import React from 'react'
import {compose} from 'redux'

import {withManageSimpleContextValue} from './utils'

const STORAGE_KEY = 'sortBy'

export const SORT_BY_OPTIONS = {
  REVENUE: 'REVENUE',
  PERFORMANCE: 'PERFORMANCE',
  FULLNESS: 'FULLNESS',
  PLEDGE: 'PLEDGE',
  MARGINS: 'MARGINS',
  STAKE: 'STAKE',
}

const DEFAULT_VALUE = SORT_BY_OPTIONS.REVENUE

const Context = React.createContext({
  sortByContext: {
    sortBy: DEFAULT_VALUE,
    setSortBy: null,
    _setSortByStorageFromQuery: null,
    _sortByStorageToQuery: null,
  },
})

export const withSortByProvider: any = compose(
  withManageSimpleContextValue(STORAGE_KEY, DEFAULT_VALUE),
  (WrappedComponent) => ({
    value: sortBy,
    setValue: setSortBy,
    _setStorageFromQuery: _setSortByStorageFromQuery,
    _storageToQuery: _sortByStorageToQuery,
    ...restProps
  }) => {
    return (
      <Context.Provider
        value={{
          sortByContext: {
            sortBy,
            setSortBy,
            _setSortByStorageFromQuery,
            _sortByStorageToQuery,
          },
        }}
      >
        <WrappedComponent {...restProps} />
      </Context.Provider>
    )
  }
)

export const withSortByContext: any = (WrappedComponent) => (props) => (
  <Context.Consumer>
    {({sortByContext}) => <WrappedComponent {...props} sortByContext={sortByContext} />}
  </Context.Consumer>
)
