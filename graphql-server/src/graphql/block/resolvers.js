import {_fetchPage, PAGE_SIZE} from './dataProviders'
import _ from 'lodash'
import assert from 'assert'

// Note: 'pages' are indexed from 1 in cardano API
// Note: 'cursor' means including the position

const INVALID_CURSOR = {data: [], cursor: null}

const _fetchInitial = async (args, context) => {
  const pageId = args.cursor && Math.ceil(args.cursor / PAGE_SIZE)
  if (pageId < 1) throw new Error('Invalid cursor value')

  const initialPage = await _fetchPage(pageId, context)

  const sizeToKeep = args.cursor
    ? args.cursor - (pageId - 1) * PAGE_SIZE
    : initialPage.blocks.length

  assert(initialPage.blocks.length >= sizeToKeep)

  return {
    nextPageId: initialPage.pageId - 1,
    blocks: initialPage.blocks.slice(-sizeToKeep),
  }
}

// countDown(5, 4) => 5,4,3,2
const countDown = (start, count) => _.range(start, start - count, -1)

const _fetchSubsequent = async (startPageId, count, context) => {
  const pageIds = countDown(startPageId, Math.min(startPageId, Math.ceil(count / PAGE_SIZE)))

  const subsequentData = await Promise.all(
    pageIds.map((id) =>
      _fetchPage(id, context).then(({blocks}) => {
        assert(blocks.length === PAGE_SIZE)
        return blocks
      })
    )
  )

  return _.flatten(subsequentData).slice(0, count)
}

export const pagedBlocksResolver = async (parent, args, context) => {
  const pageId = args.cursor && Math.ceil(args.cursor / PAGE_SIZE)
  if (pageId < 1) return INVALID_CURSOR

  const resultPageSize = PAGE_SIZE // hardcoded for now

  const {nextPageId, blocks: initialBlocks} = await _fetchInitial(args, context)

  const remainingCount = Math.max(0, resultPageSize - initialBlocks.length)

  const subsequentBlocks = await _fetchSubsequent(nextPageId, remainingCount, context)

  const nextCursor = nextPageId * PAGE_SIZE - remainingCount

  return {
    cursor: nextCursor > 0 ? nextCursor : null,
    data: [...initialBlocks, ...subsequentBlocks],
  }
}

export const pagedBlocksInEpochResolver = (parent, args, context) => {
  // TODO: Add logic to query blocks in target epoch
  return pagedBlocksResolver(parent, args, context)
}
