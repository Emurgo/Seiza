// @flow

import * as React from 'react'

import * as urlUtils from '@/helpers/url'
import {SelectedPoolsProvider, useSelectedPoolsContext} from './selectedPools'
import {SortByProvider, useSortByContext} from './sortBy'
import {SearchTextProvider, useSearchTextContext} from './searchText'
import {PerformanceProvider, usePerformanceContext} from './performance'
import {UserAdaProvider, useUserAdaContext} from './userAda'

import {useUrlManager} from '@/components/hooks/useUrlManager'

type ProviderProps = {|
  children: React.Node,
  autoSync: ?boolean,
|}

export const StakingContextProvider = ({children, autoSync}: ProviderProps) => (
  <SelectedPoolsProvider autoSync={autoSync}>
    <SortByProvider autoSync={autoSync}>
      <SearchTextProvider autoSync={autoSync}>
        <PerformanceProvider autoSync={autoSync}>
          <UserAdaProvider autoSync={autoSync}>{children}</UserAdaProvider>
        </PerformanceProvider>
      </SearchTextProvider>
    </SortByProvider>
  </SelectedPoolsProvider>
)

export function useSetListScreenStorageFromQuery() {
  const {_setSortByStorageFromQuery, _sortByStorageToQuery} = useSortByContext()
  const {_setPerformanceStorageFromQuery, _performanceStorageToQuery} = usePerformanceContext()
  const {_setSearchTextStorageFromQuery, _searchTextStorageToQuery} = useSearchTextContext()
  const {
    _setSelectedPoolsStorageFromQuery,
    _selectedPoolsStorageToQuery,
  } = useSelectedPoolsContext()
  const {_setUserAdaStorageFromQuery, _userAdaStorageToQuery} = useUserAdaContext()

  const getScreenUrlQuery = () => {
    const selectedPoolsQuery = _selectedPoolsStorageToQuery()
    const sortByQuery = _sortByStorageToQuery()
    const searchTextQuery = _searchTextStorageToQuery()
    const performanceQuery = _performanceStorageToQuery()
    const userAdaQuery = _userAdaStorageToQuery()

    return urlUtils.joinQueryStrings([
      selectedPoolsQuery,
      sortByQuery,
      searchTextQuery,
      performanceQuery,
      userAdaQuery,
    ])
  }

  const setScreenStorageFromQuery = (query: string) => {
    _setSelectedPoolsStorageFromQuery(query)
    _setSortByStorageFromQuery(query)
    _setSearchTextStorageFromQuery(query)
    _setPerformanceStorageFromQuery(query)
    _setUserAdaStorageFromQuery(query)
  }

  return {setScreenStorageFromQuery, getScreenUrlQuery}
}

export function useSetBasicScreenStorageFromQuery() {
  const {
    _setSelectedPoolsStorageFromQuery,
    _selectedPoolsStorageToQuery,
  } = useSelectedPoolsContext()

  const getScreenUrlQuery = () => {
    const selectedPoolsQuery = _selectedPoolsStorageToQuery()
    return urlUtils.joinQueryStrings([selectedPoolsQuery])
  }

  const setScreenStorageFromQuery = (query: string) => {
    _setSelectedPoolsStorageFromQuery(query)
  }

  return {setScreenStorageFromQuery, getScreenUrlQuery}
}

export function useResetUrlAndStorage() {
  const {setQuery} = useUrlManager()
  const {_setSortByStorageToDefault} = useSortByContext()
  const {_setSelectedPoolsStorageToDefault} = useSelectedPoolsContext()
  const {_setPerformanceStorageToDefault} = usePerformanceContext()
  const {_setSearchTextStorageToDefault} = useSearchTextContext()
  const {_setUserAdaStorageToDefault} = useUserAdaContext()

  // Note: we do not reset "selected pools" intentionally
  // Note: we can not perform url replacement in separate `_reset` functions as
  // they have all closured initial urlQuery and would rewrite sooner rewritten urlQuery
  const resetUrlAndStorage = () => {
    _setPerformanceStorageToDefault()
    _setSortByStorageToDefault()
    _setSelectedPoolsStorageToDefault()
    _setSearchTextStorageToDefault()
    _setUserAdaStorageToDefault()

    setQuery('')
  }

  return resetUrlAndStorage
}
