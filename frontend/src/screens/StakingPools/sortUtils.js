// @flow

import React, {useState, useCallback, useContext} from 'react'

import {fieldsConfig} from './fieldsConfig'

type ContextType = {
  sortOptions: {field: string, order: 'asc' | 'desc'},
  setSortBy: Function,
}

const Context = React.createContext<ContextType>({})

export const ORDER = {
  ASC: 'asc',
  DESC: 'desc',
}

const _useSortOptions = (onChange) => {
  const [sortOptions, setSortOptions] = useState({field: fieldsConfig[0].field, order: ORDER.DESC})

  const _setSortBy = useCallback(
    (field) => {
      setSortOptions({
        field,
        order:
          sortOptions.field === field
            ? sortOptions.order === ORDER.DESC
              ? ORDER.ASC
              : ORDER.DESC
            : ORDER.DESC,
      })
    },
    [sortOptions.order, sortOptions.field]
  )

  const setSortBy = useCallback(
    (...args) => {
      _setSortBy(...args)
      onChange()
    },
    [_setSortBy, onChange]
  )

  return {sortOptions, setSortBy}
}

type ProviderProps = {|
  children: React$Node,
  onChange: Function,
|}

export const SortOptionsProvider = ({children, onChange}: ProviderProps) => {
  const {sortOptions, setSortBy} = _useSortOptions(onChange)
  return <Context.Provider value={{sortOptions, setSortBy}}>{children}</Context.Provider>
}

export const useSortOptions = () => useContext(Context)
