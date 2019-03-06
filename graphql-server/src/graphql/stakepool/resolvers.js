import {fetchBootstrapEraPool, fetchBootstrapEraPoolList, BOOTSTRAP_POOLS} from './dataProviders'

const INVALID_CURSOR = {data: [], cursor: null, hasMore: false}

const DEFAULT_PAGE_SIZE = 10

export const pagedStakePoolListResolver = (api, cursor, pageSize) => {
  if (cursor != null && !BOOTSTRAP_POOLS.includes(cursor)) return INVALID_CURSOR

  const _cursor = cursor || BOOTSTRAP_POOLS[0]
  const _pageSize = pageSize || DEFAULT_PAGE_SIZE

  const cursorPosition = BOOTSTRAP_POOLS.indexOf(_cursor)
  const nextCursorPosition = cursorPosition + _pageSize

  const data = BOOTSTRAP_POOLS.slice(cursorPosition, nextCursorPosition).map((pool) =>
    fetchBootstrapEraPool(api, pool)
  )
  const nextCursor =
    nextCursorPosition < BOOTSTRAP_POOLS.length ? BOOTSTRAP_POOLS[nextCursorPosition] : null

  return {
    cursor: nextCursor,
    stakePools: data,
    hasMore: nextCursor != null,
    totalCount: BOOTSTRAP_POOLS.length, // TODO: calculate with respect to filters
  }
}

export default {
  Query: {
    stakePool: (root, args, context) =>
      fetchBootstrapEraPool(null, args.poolHash, args.epochNumber),
    stakePools: (root, args, context) =>
      args.poolHashes.map((poolHash) => fetchBootstrapEraPool(null, poolHash, args.epochNumber)),
    stakePoolList: (root, args, context) => fetchBootstrapEraPoolList(null, args.epochNumber),
    pagedStakePoolList: (_, args, context) =>
      pagedStakePoolListResolver(null, args.cursor, args.pageSize),
  },
}
