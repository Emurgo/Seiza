// @flow

import React, {useCallback, useContext} from 'react'

import {useManageQueryValue} from '@/components/hooks/useManageQueryValue'
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

const encode = (val) => `${val.order === ORDER.DESC ? '-' : ''}${val.field}`
const decode = (str) => ({
  order: str[0] === '-' ? ORDER.DESC : ORDER.ASC,
  field: str.substring(1),
})

const _useSortOptions = (onChange) => {
  const [sortOptions, setSortOptions] = useManageQueryValue(
    'sort',
    encode({field: fieldsConfig[0].field, order: ORDER.DESC}),
    decode
  )

  const _setSortBy = useCallback(
    (field) => {
      const newSortOptions = encode({
        field,
        order:
          sortOptions.field === field
            ? sortOptions.order === ORDER.DESC
              ? ORDER.ASC
              : ORDER.DESC
            : ORDER.DESC,
      })
      setSortOptions(newSortOptions)
    },
    [setSortOptions, sortOptions.field, sortOptions.order]
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
