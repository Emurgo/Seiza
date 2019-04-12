import moment from 'moment'
import assert from 'assert'
import {parseAdaValue} from '../utils'

export const facadeElasticBlock = (data) => ({
  epoch: data.epoch,
  slot: data.slot,
  blockHash: data.hash,
  timeIssued: moment(data.time),
  transactionsCount: data.tx_num,
  totalSend: parseAdaValue(data.sent),
  totalFees: parseAdaValue(data.fees),
  size: data.size,
  _blockLeader: data.lead,
  _txs: data.tx.map((tx) => tx.hash),
  // New
  height: data.height,
  blockHeight: data.height,
})

export const fetchBlockByHash = async ({elastic, E}, blockHash) => {
  assert(blockHash)
  const hit = await elastic
    .q('slot')
    .filter(E.matchPhrase('hash', blockHash))
    .getSingleHit()

  return facadeElasticBlock(hit._source)
}

export const fetchLatestBlock = async ({elastic, E}) => {
  const hit = await elastic
    .q('slot')
    .filter(E.notNull('hash'))
    .sortBy('height', 'desc')
    .getFirstHit()

  return facadeElasticBlock(hit._source)
}

export const fetchBlockBySlot = async ({elastic, E}, {epoch, slot}) => {
  assert(epoch != null)
  assert(slot != null)

  const hit = await elastic
    .q('slot')
    .filter(E.onlyActiveFork())
    .filter(E.eq('epoch', epoch))
    .filter(E.eq('slot', slot))
    .getSingleHit()

  return facadeElasticBlock(hit._source)
}

export const fetchPreviousBlock = async ({elastic, E}, {epoch, slot}) => {
  assert(epoch != null)
  assert(slot != null)

  const hits = await elastic
    .q('slot')
    .filter(E.onlyActiveFork())
    .filter(E.notNull('hash'))
    .filter(
      E.some([
        // Either same epoch and lower slot
        E.all([E.eq('epoch', epoch), E.lt('slot', slot)]),
        // Or lower epoch
        E.lt('epoch', epoch),
      ])
    )
    .sortBy('epoch', 'desc')
    .sortBy('slot', 'desc')
    .getHits(1)

  if (hits.total === 0) {
    return null
  } else {
    return facadeElasticBlock(hits.hits[0]._source)
  }
}

export const fetchNextBlock = async ({elastic, E}, {epoch, slot}) => {
  assert(epoch != null)
  assert(slot != null)

  const hits = await elastic
    .q('slot')
    .filter(E.onlyActiveFork())
    .filter(E.notNull('hash'))
    .filter(
      E.some([
        // Either same epoch and higher slot
        E.all([E.eq('epoch', epoch), E.gt('slot', slot)]),
        // Or higher epoch
        E.gt('epoch', epoch),
      ])
    )
    .sortBy('epoch', 'asc')
    .sortBy('slot', 'asc')
    .getHits(1)

  if (hits.total === 0) {
    return null
  } else {
    return facadeElasticBlock(hits.hits[0]._source)
  }
}
