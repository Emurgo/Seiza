// @flow

import _ from 'lodash'
import React, {useCallback, useContext, useMemo} from 'react'

import {useManageQueryValue} from '@/components/hooks/useManageQueryValue'
import {rangeFields, fieldsConfigMap, fieldsConfig} from './fieldsConfig'

import type {SliderRange} from './types'

type Filter = {
  // TODO: how to make this flow friendly as range/text/other filters may store
  // different value types and properties?
  // TODO: move "range" under "options/config" in next PR
  value: any,
  range?: SliderRange,
}

type ContextType = {
  filters: {[key: string]: Filter},
  setFilter: Function,
  resetFilters: Function,
  resetFilter: Function,
}

export const Context = React.createContext<ContextType>({})

const getInitialFiltersState = (ranges) =>
  fieldsConfig
    // $FlowFixMe
    .filter((c) => c.filter)
    .reduce(
      (acc, c) => ({
        ...acc,
        [c.field]: {
          value: null,
          // $FlowFixMe
          ...(ranges[c.field] ? {range: ranges[c.field]} : {}),
        },
      }),
      {}
    )

const mergeInitialStateWithUrl = (urlState, initialState) =>
  _.mapValues(initialState, (filter, key) => ({
    ...filter,
    value: urlState[key] || initialState[key].value,
  }))

const encode = (filters) => {
  if (!filters) return ''

  const stateToEncode = _(filters)
    .pickBy((filter) => filter.value)
    .mapValues((filter) => filter.value)
    .value()

  return _.isEmpty(stateToEncode) ? '' : JSON.stringify(stateToEncode)
}

const decode = (str) => (str ? JSON.parse(str) : {})

const _useFilters = (ranges) => {
  const initialState = useMemo(() => getInitialFiltersState(ranges), [ranges])

  const [filtersUrlState, setFiltersUrlState] = useManageQueryValue('filters', encode(), decode)

  const filters = useMemo(() => mergeInitialStateWithUrl(filtersUrlState, initialState), [
    initialState,
    filtersUrlState,
  ])

  const setFilter = useCallback(
    (filterName, value) => {
      const newState = {...filters, [filterName]: {...filters[filterName], value}}
      setFiltersUrlState(encode(newState))
    },
    [filters, setFiltersUrlState]
  )

  const resetFilters = useCallback(() => setFiltersUrlState(encode()), [setFiltersUrlState])

  const resetFilter = useCallback((filterName) => setFilter(filterName, null), [setFilter])

  return {filters, setFilter, resetFilters, resetFilter}
}

const getFilterRange = (field, allPools) => {
  const values = allPools.map((pool) => Number(pool[field]))
  return [_.min(values), _.max(values)]
}

export const useFilteredPools = (stakepools: Array<{}>, filters: {[key: string]: Filter}) =>
  useMemo(
    (): Array<{}> =>
      stakepools.filter((data) =>
        Object.entries(filters)
          // $FlowFixMe TODO: fix flow
          .filter(([key, filter]) => filter.value)
          // $FlowFixMe TODO: fix flow
          .every(([key, {value}]) => {
            const {dataMatchFilter} = fieldsConfigMap[key].filter
            return dataMatchFilter(data[key], value)
          })
      ),
    [stakepools, filters]
  )

type ProviderProps = {|
  children: React$Node,
  allPools: Array<{}>,
|}

export const FiltersProvider = ({children, allPools}: ProviderProps) => {
  const ranges = useMemo(
    () =>
      rangeFields.reduce((acc, field) => ({...acc, [field]: getFilterRange(field, allPools)}), {}),
    [allPools]
  )

  const {filters, setFilter, resetFilters, resetFilter} = _useFilters(ranges)

  return (
    <Context.Provider value={{filters, setFilter, resetFilters, resetFilter}}>
      {children}
    </Context.Provider>
  )
}

export const useFilters = () => useContext(Context)
