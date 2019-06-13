import {facadeElasticBlock} from './dataProviders'
import assert from 'assert'
import E from '../../api/elasticHelpers'
import {validate} from '../../utils/validation'

const PAGE_SIZE = 10

const currentBlocks = E.q('slot')
  .filter(E.onlyActiveFork())
  .filter(E.notNull('hash'))

export const pagedBlocksResolver = async (parent, args, context) => {
  const {cursor} = args
  const {elastic, E} = context

  const {total, hits} = await elastic
    .q(currentBlocks)
    .filter(E.lte('height', cursor))
    .sortBy('height', 'desc')
    .getHits(PAGE_SIZE)

  const blockData = hits.map((h) => facadeElasticBlock(h._source))
  // TODO: maybe return empty result?
  assert(hits.length > 0)

  const startHeight = blockData[0].height

  // self-check
  await context.runConsistencyCheck(() => {
    validate(total === startHeight, 'Blocks height inconsistency', {
      startHeight,
      total,
      cursor,
      blockData,
    })
  })

  const nextCursor = startHeight - PAGE_SIZE

  const totalCount = await elastic.q(currentBlocks).getCount()

  return {
    cursor: nextCursor > 0 ? nextCursor : null,
    hasMore: nextCursor > 0,
    blocks: blockData,
    totalCount,
  }
}

export const pagedBlocksInEpochResolver = async (parent, args, context) => {
  const {cursor, epochNumber: epoch} = args
  const {elastic, E} = context

  // Note: this is a workaround
  const {total: previousEpochs, hits: previousEnd} = await elastic
    .q(currentBlocks)
    .filter(E.lt('epoch', epoch))
    .sortBy('height', 'desc')
    .getHits(1)

  if (epoch > 0) {
    assert(previousEnd.length > 0)
    assert(previousEnd[0]._source.height === previousEpochs)
  }

  const totalCount = await elastic
    .q(currentBlocks)
    .filter(E.eq('epoch', epoch))
    .getCount()

  const hits = await elastic
    .q(currentBlocks)
    .filter(E.eq('epoch', epoch))
    .filter(cursor && E.lte('height', cursor + previousEpochs))
    .sortBy('height', 'desc')
    .getHits(PAGE_SIZE)

  if (cursor) {
    assert(hits.total === Math.min(cursor, totalCount))
  }

  const blockData = hits.hits.map((h) => facadeElasticBlock(h._source))

  // When we query epoch that did not start yet
  if (!blockData.length) {
    return {
      cursor: null,
      hasMore: false,
      blocks: [],
      totalCount,
    }
  }

  const startHeight = blockData[0].height
  const nextCursor = startHeight - PAGE_SIZE - previousEpochs

  return {
    cursor: nextCursor > 0 ? nextCursor : null,
    hasMore: nextCursor > 0,
    blocks: blockData,
    totalCount,
  }
}
