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
