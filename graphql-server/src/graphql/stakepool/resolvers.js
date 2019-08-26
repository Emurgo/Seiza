import _ from 'lodash'
import BigNumber from 'bignumber.js'

import {
  fetchBootstrapEraPool,
  fetchBootstrapEraPoolList,
  fetchBootstrapEraPoolSummary,
} from './dataProviders'

import {currentStatusResolver} from '../status/resolvers'
import {MOCKED_STAKEPOOLS} from './mockedPools'
import {calculateAge} from '../utils'

const EMPTY_RESPONSE = {
  cursor: null,
  stakePools: [],
  hasMore: false,
  totalCount: 0,
}
const INVALID_CURSOR = EMPTY_RESPONSE
const NO_RESULTS = EMPTY_RESPONSE

const DEFAULT_PAGE_SIZE = 10

// TODO: This whole resolver would need to be structure better, but we should
// do it once we have real data to get a better picture

// Note: this does not do half-open interval intentionally
const inRange = (v, from, to) => v >= from && v <= to

const getPoolsData = (api) =>
  fetchBootstrapEraPoolList(api).map((pool) => ({
    ...pool,
    summary: fetchBootstrapEraPoolSummary(api, pool.poolHash),
  }))

const basicSearchFilter = (textToMatch) => (pool) => pool.name.includes(textToMatch)
const exactSearchFilter = (textToMatch) => (pool) => pool.name === textToMatch

const filterData = (data, searchText, exactMatch, performance) => {
  const _filtered = searchText
    ? data.filter(exactMatch ? exactSearchFilter(searchText) : basicSearchFilter(searchText))
    : data
  return performance
    ? _filtered.filter((pool) =>
      inRange(pool.summary.performance, performance.from, performance.to)
    )
    : _filtered
}

const sortData = (data, sortBy) => _.orderBy(data, (d) => d.summary[sortBy], 'desc')

const getFilteredAndSortedPoolsData = (api, sortBy, searchText, exactMatch, performance) => {
  const data = getPoolsData(api)
  const filteredData = filterData(data, searchText, exactMatch, performance)
  return sortData(filteredData, sortBy)
}

export const pagedStakePoolListResolver = (
  api,
  cursor,
  pageSize = DEFAULT_PAGE_SIZE,
  searchOptions
) => {
  const {sortBy, searchText, exactMatch, performance} = searchOptions
  const data = getFilteredAndSortedPoolsData(api, sortBy, searchText, exactMatch, performance)

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

const ageResolver = async (pool, args, context) => {
  const currentEpoch = await currentStatusResolver(null, args, context).epochNumber()
  return calculateAge(pool.createdAt, currentEpoch)
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
  StakePoolSummary: {
    averageUserStaking: (stakepoolSummary) => {
      return new BigNumber(stakepoolSummary.adaStaked)
        .minus(stakepoolSummary.ownerPledge.declared)
        .dividedBy(stakepoolSummary.stakersCount)
        .toFixed(0)
    },
    usersAdaStaked: (stakepoolSummary) => {
      return new BigNumber(stakepoolSummary.adaStaked).minus(stakepoolSummary.ownerPledge.declared)
    },
  },
  BootstrapEraStakePool: {
    age: ageResolver,
  },
  MockedStakePool: {
    age: ageResolver,
  },
  Query: {
    stakePool: (root, args, context) =>
      fetchBootstrapEraPool(null, args.poolHash, args.epochNumber),
    stakePools: (root, args, context) =>
      args.poolHashes.map((poolHash) => fetchBootstrapEraPool(null, poolHash, args.epochNumber)),
    stakePoolList: (root, args, context) => fetchBootstrapEraPoolList(null, args.epochNumber),
    pagedStakePoolList: (_, args, context) =>
      pagedStakePoolListResolver(null, args.cursor, args.pageSize, args.searchOptions),
    mockedStakePools: (root, args, context) => MOCKED_STAKEPOOLS,
  },
}
