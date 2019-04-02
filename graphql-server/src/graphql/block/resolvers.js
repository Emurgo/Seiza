import {facadeElasticBlock} from './dataProviders'
import assert from 'assert'
const PAGE_SIZE = 10

export const pagedBlocksResolver = async (parent, args, context) => {
  const {cursor} = args
  const {elastic} = context

  const {hits} = await elastic.search({
    index: 'seiza.block',
    type: 'block',
    body: {
      query: elastic._filter([
        elastic._currentBranch(),
        elastic._notNull('hash'),
        elastic._lte('height', cursor),
      ]),
      sort: elastic._orderBy([['height', 'desc']]),
      size: PAGE_SIZE,
    },
  })

  const blockData = hits.hits.map((h) => facadeElasticBlock(h._source))
  assert(hits.hits.length <= PAGE_SIZE)
  // TODO: maybe return empty result?
  assert(hits.hits.length > 0)

  const startHeight = blockData[0].height
  // self-check
  assert(hits.total === startHeight)

  const nextCursor = startHeight - PAGE_SIZE

  return {
    cursor: nextCursor > 0 ? nextCursor : null,
    data: blockData,
  }
}

export const pagedBlocksInEpochResolver = async (parent, args, context) => {
  const {cursor, epochNumber: epoch} = args
  const {elastic} = context

  // Note: this is a workaround
  const {
    hits: {total: previousEpochs, hits: previousEnd},
  } = await elastic.search({
    index: 'seiza.block',
    type: 'block',
    body: {
      query: elastic._filter([
        elastic._onlyActiveFork(),
        elastic._notNull('hash'),
        elastic._lt('epoch', epoch),
      ]),
      sort: elastic._orderBy([['height', 'desc']]),
      size: 1,
    },
  })

  if (epoch > 0) {
    assert(previousEnd.length > 0)
    assert(previousEnd[0]._source.height === previousEpochs)
  }

  const {hits} = await elastic.search({
    index: 'seiza.block',
    type: 'block',
    body: {
      query: elastic._filter([
        elastic._onlyActiveFork(),
        elastic._notNull('hash'),
        cursor && elastic._lte('height', cursor + previousEpochs),
        elastic._exact('epoch', epoch),
      ]),
      sort: elastic._orderBy([['height', 'desc']]),
      size: PAGE_SIZE,
    },
  })

  if (cursor) {
    assert(hits.total === cursor)
  }

  const blockData = hits.hits.map((h) => facadeElasticBlock(h._source))

  const startHeight = blockData[0].height
  const nextCursor = startHeight - PAGE_SIZE - previousEpochs

  return {
    cursor: nextCursor > 0 ? nextCursor : null,
    data: blockData,
  }
}
