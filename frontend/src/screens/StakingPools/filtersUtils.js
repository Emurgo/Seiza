// @flow

import _ from 'lodash'
import React, {useCallback, useContext, useMemo} from 'react'

import {useManageQueryValue} from '@/components/hooks/useManageQueryValue'
import {rangeFields, fieldsConfigMap, fieldsConfig, FILTER_KEY_VALUE_DIVIDER} from './fieldsConfig'

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
  if (!filters) return null

  const stateToEncode = _(filters)
    .pickBy((filter) => filter.value)
    .mapValues((filter, field) => fieldsConfigMap[field].filter.encodeValue(filter.value))
    .map((filter, key) => `${key}${FILTER_KEY_VALUE_DIVIDER}${filter}`)
    .value()

  return _.isEmpty(stateToEncode) ? null : stateToEncode
}

const decode = (arr) => {
  if (!arr) return {}

  return arr.reduce((res, item) => {
    const [key, value] = item.split(FILTER_KEY_VALUE_DIVIDER)
    return {
      ...res,
      [key]: fieldsConfigMap[key].filter.decodeValue(value),
    }
  }, {})
}

const _useFilters = (ranges, onChange) => {
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
      onChange()
    },
    [filters, onChange, setFiltersUrlState]
  )

  const resetFilters = useCallback(() => {
    setFiltersUrlState(encode())
    onChange()
  }, [onChange, setFiltersUrlState])

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
  onChange: Function,
|}

export const FiltersProvider = ({children, allPools, onChange}: ProviderProps) => {
  const ranges = useMemo(
    () =>
      rangeFields.reduce((acc, field) => ({...acc, [field]: getFilterRange(field, allPools)}), {}),
    [allPools]
  )

  const {filters, setFilter, resetFilters, resetFilter} = _useFilters(ranges, onChange)

  return (
    <Context.Provider value={{filters, setFilter, resetFilters, resetFilter}}>
      {children}
    </Context.Provider>
  )
}

export const useFilters = () => useContext(Context)
