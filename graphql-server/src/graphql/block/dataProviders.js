import moment from 'moment'
import assert from 'assert'

import {
  parseAdaValue,
  annotateNotFoundError,
  runConsistencyCheck,
  getEstimatedSlotTimestamp,
  validate,
} from '../utils'
import E from '../../api/elasticHelpers'

export const facadeElasticBlock = (data) => ({
  epoch: data.epoch,
  slot: data.slot,
  blockHash: data.hash,
  timeIssued: moment(data.time),
  transactionsCount: data.tx_num,
  totalSent: parseAdaValue(data.sent),
  totalFees: parseAdaValue(data.fees),
  size: data.size,
  _blockLeader: data.lead,
  _txs: data.tx.map((tx) => tx.hash),
  // New
  height: data.height,
  blockHeight: data.height,
})

const facadeAndValidate = async (data) => {
  await runConsistencyCheck(() => {
    validate(
      getEstimatedSlotTimestamp(data.epoch, data.slot) === moment(data.time).unix(),
      'Slot timestamp vs estimated timestamp mismatch',
      {data}
    )
  })
  return facadeElasticBlock(data)
}

const currentBlocks = E.q('slot')
  .filter(E.onlyActiveFork())
  .filter(E.notNull('hash'))

export const fetchBlockByHash = async ({elastic, E}, blockHash) => {
  assert(blockHash)
  const hit = await elastic
    .q(currentBlocks)
    .filter(E.matchPhrase('hash', blockHash))
    .getSingleHit()
    .catch(annotateNotFoundError({entity: 'Block'}))

  await runConsistencyCheck(async () => {
    const txCnt = await elastic
      .q('tx')
      .filter(E.onlyActiveFork())
      .filter(E.matchPhrase('block_hash', blockHash))
      .getCount()

    validate(txCnt === hit._source.tx_num, 'Tx count inconsistency', {
      fromBlocks: hit._source.tx_num,
      fromTransactions: txCnt,
    })
  })

  return facadeAndValidate(hit._source)
}

export const fetchLatestBlock = async ({elastic, E}) => {
  const hit = await elastic
    .q(currentBlocks)
    .sortBy('height', 'desc')
    .getFirstHit()

  return facadeAndValidate(hit._source)
}

export const fetchBlockBySlot = async ({elastic, E}, {epoch, slot}) => {
  assert(epoch != null)
  assert(slot != null)

  const hit = await elastic
    .q(currentBlocks)
    .filter(E.eq('epoch', epoch))
    .filter(E.eq('slot', slot))
    .getSingleHit()
    .catch(annotateNotFoundError({entity: 'Slot'}))

  return facadeAndValidate(hit._source)
}

const tupleLt = (key1, key2) => (value1, value2) =>
  E.some([
    // either first is smaller
    E.lt(key1, value1),
    // or second is smaller
    E.all([E.eq(key1, value1), E.lt(key2, value2)]),
  ])

const tupleGt = (key1, key2) => (value1, value2) =>
  E.some([
    // either first is smaller
    E.gt(key1, value1),
    // or second is smaller
    E.all([E.eq(key1, value1), E.gt(key2, value2)]),
  ])

// TODO: extract repetitive code
export const fetchPreviousBlock = async ({elastic, E}, {epoch, slot}) => {
  assert(epoch != null)
  assert(slot != null)

  const hits = await elastic
    .q(currentBlocks)
    .filter(tupleLt('epoch', 'slot')(epoch, slot))
    .sortBy('epoch', 'desc')
    .sortBy('slot', 'desc')
    .getHits(1)

  if (hits.total === 0) {
    return null
  } else {
    return facadeAndValidate(hits.hits[0]._source)
  }
}

// TODO: extract repetitive code
export const fetchNextBlock = async ({elastic, E}, {epoch, slot}) => {
  assert(epoch != null)
  assert(slot != null)

  const hits = await elastic
    .q(currentBlocks)
    .filter(tupleGt('epoch', 'slot')(epoch, slot))
    .sortBy('epoch', 'asc')
    .sortBy('slot', 'asc')
    .getHits(1)

  if (hits.total === 0) {
    return null
  } else {
    return facadeAndValidate(hits.hits[0]._source)
  }
}
