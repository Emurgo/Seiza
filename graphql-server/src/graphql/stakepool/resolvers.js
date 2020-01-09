import _ from 'lodash'
import BigNumber from 'bignumber.js'
// TODO: Fix fetchBootstrapEraPool import not found
import {fetchBootstrapEraPool, fetchPoolList} from './dataProviders'

import {currentStatusResolver} from '../status/resolvers'
import {MOCKED_STAKEPOOLS} from './mockedPools'
import {calculateAge} from '../utils'

const StakePoolSortByEnum = Object.freeze({
  RANDOM: 'randon',
  REVENUE: 'revenue',
  PERFORMANCE: 'performance',
  FULLNESS: 'fullness',
  PLEDGE: 'pledge',
  MARGINS: 'margins',
  STAKE: 'stake',
})

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

const getPoolsData = async (context, userAda) => {
  return await fetchPoolList(context, userAda)
}

const filterByNameOrHash = (data, searchTextLowerCase) =>
  data.filter((pool) => {
    const nameFound =
      pool.name !== null ? pool.name.toLowerCase().includes(searchTextLowerCase) : false
    const hashFound =
      pool.poolHash !== null ? pool.poolHash.toLowerCase().includes(searchTextLowerCase) : false
    return nameFound || hashFound
  })

const filterData = async (data, searchText, performance) => {
  const searchTextLowerCase = searchText.toLowerCase()
  const _filtered = searchText ? filterByNameOrHash(data, searchTextLowerCase) : data

  return (await performance)
    ? _filtered.filter((pool) =>
      inRange(pool.summary.performance, performance.from, performance.to)
    )
    : _filtered
}

const sortData = async (data, sortBy, userIp) => {
  switch (sortBy) {
    case StakePoolSortByEnum.REVENUE:
      return await _.orderBy(data, (d) => d.summary[sortBy], 'desc')
    case StakePoolSortByEnum.MARGINS:
      return await _.orderBy(data, (d) => d.summary[sortBy], 'asc')
    case StakePoolSortByEnum.RANDOM: {
      const ip = userIp || 'default_hash'
      // sort the pool differently for each user in a deterministic way to avoid breaking pagination
      // we do this by hashing the user's IP address with the poolHash
      const hashCode = (s) =>
        s // taken from Java
          .split('')
          .reduce(
            (a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, // eslint-disable-line no-bitwise
            0
          )
      return await _.orderBy(data, (d) => hashCode(d.poolHash + ip), 'desc')
    }
    default:
      return data
  }
}

const getFilteredAndSortedPoolsData = async (context, sortBy, searchText, performance, userAda) => {
  const poolData = await getPoolsData(context, userAda)
  const filteredData = await filterData(poolData, searchText, performance)
  return await sortData(filteredData, sortBy, context.userIp)
}

export const pagedStakePoolListResolver = async (
  context,
  cursor,
  pageSize = DEFAULT_PAGE_SIZE,
  searchOptions
) => {
  const {sortBy, searchText, performance, userAda} = searchOptions
  const data = await getFilteredAndSortedPoolsData(
    context,
    sortBy,
    searchText,
    performance,
    userAda
  )

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
  // TODO: Fix this
  // const currentEpoch = await currentStatusResolver(null, args, context).epochNumber()
  // return calculateAge(pool.createdAt, currentEpoch)
  return 0
}

export default {
  StakePoolSortByEnum,
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
    // TODO: needs update
    stakePool: (root, args, context) =>
      fetchBootstrapEraPool(context, args.poolHash, args.epochNumber),
    // TODO: needs updaet
    stakePools: (root, args, context) => fetchPoolList(context),
    // TODO: needs update
    stakePoolList: (root, args, context) => fetchPoolList(context),
    pagedStakePoolList: (_, args, context) =>
      pagedStakePoolListResolver(context, args.cursor, args.pageSize, args.searchOptions),
    mockedStakePools: (root, args, context) => MOCKED_STAKEPOOLS,
  },
}
