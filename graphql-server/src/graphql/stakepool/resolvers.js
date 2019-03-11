import _ from 'lodash'
import {
  fetchBootstrapEraPool,
  fetchBootstrapEraPoolList,
  fetchBootstrapEraPoolSummary,
  BOOTSTRAP_POOLS,
} from './dataProviders'

const EMPTY_RESPONSE = {cursor: null, stakePools: [], hasMore: false, totalCount: 0}
const INVALID_CURSOR = EMPTY_RESPONSE
const NO_RESULTS = EMPTY_RESPONSE

const DEFAULT_PAGE_SIZE = 10

// TODO: This whole resolver would need to be structure better, but we should
// do it once we have real data to get a better picture

const getPoolsData = (api) => {
  return BOOTSTRAP_POOLS.map((pool) => ({
    ...fetchBootstrapEraPool(api, pool),
    summary: fetchBootstrapEraPoolSummary(api, pool),
  }))
}

const filterData = (data, searchText) => {
  return searchText ? data.filter((pool) => pool.name.includes(searchText)) : data
}

const sortData = (data, sortBy) => _.orderBy(data, (d) => d.summary[sortBy], 'desc')

const getFilteredAndSortedPoolsData = (api, sortBy, searchText) => {
  const data = getPoolsData(api)
  const filteredData = filterData(data, searchText)
  return sortData(filteredData, sortBy)
}

export const pagedStakePoolListResolver = (
  api,
  cursor,
  sortBy,
  searchText,
  pageSize = DEFAULT_PAGE_SIZE
) => {
  const data = getFilteredAndSortedPoolsData(api, sortBy, searchText)

  if (!data.length) return NO_RESULTS

  const _cursor = cursor || data[0].poolHash
  const cursorPosition = data.findIndex((pool) => pool.poolHash === _cursor)

  if (cursorPosition === -1) return INVALID_CURSOR

  const nextCursorPosition = cursorPosition + pageSize

  const pagedData = data.slice(cursorPosition, nextCursorPosition)

  const nextCursor = nextCursorPosition < data.length ? data[nextCursorPosition].poolHash : null

  return {
    cursor: nextCursor,
    stakePools: pagedData,
    hasMore: nextCursor != null,
    totalCount: data.length,
  }
}

export default {
  StakePoolSortByEnum: {
    REVENUE: 'revenue',
    PERFORMANCE: 'performance',
    FULLNESS: 'fullness',
    PLEDGE: 'pledge',
    MARGINS: 'margins',
    STAKE: 'stake',
  },
  Query: {
    stakePool: (root, args, context) =>
      fetchBootstrapEraPool(null, args.poolHash, args.epochNumber),
    stakePools: (root, args, context) =>
      args.poolHashes.map((poolHash) => fetchBootstrapEraPool(null, poolHash, args.epochNumber)),
    stakePoolList: (root, args, context) => fetchBootstrapEraPoolList(null, args.epochNumber),
    pagedStakePoolList: (_, args, context) =>
      pagedStakePoolListResolver(null, args.cursor, args.sortBy, args.searchText, args.pageSize),
  },
}
