import moment from 'moment'
import Bignumber from 'bignumber.js'
import assert from 'assert'
import {ApolloError} from 'apollo-server'

export const facadeBlock = (data) => ({
  blockHash: data.cbeBlkHash,
  epoch: data.cbeEpoch,
  slot: data.cbeSlot,
  timeIssued: moment.unix(data.cbeTimeIssued),
  transactionsCount: data.cbeTxNum,
  totalSend: data.cbeTotalSent.getCoin,
  size: data.cbeSize,
  _blockLeader: data.cbeBlockLead,
  totalFees: data.cbeFees.getCoin,
})

export const facadeElasticBlock = (data) => ({
  epoch: data.epoch,
  slot: data.slot,
  blockHash: data.hash,
  timeIssued: moment(data.time),
  transactionsCount: data.tx_num,
  totalSend: new Bignumber(data.sent),
  totalFees: new Bignumber(data.fees),
  size: data.size,
  _blockLeader: data.lead,
  // New
  height: data.height,
  blockHeight: data.height,
})

export const fetchBlockByHash = async ({elastic}, blockHash) => {
  assert(blockHash)
  const {hits} = await elastic.search({
    index: 'seiza.block',
    type: 'block',
    body: {
      query: elastic._matchPhrase('hash', blockHash),
    },
  })

  // TODO: generate only warning for total>0?
  assert(hits.total <= 1)

  // TODO: better error handling of total==0
  if (hits.total !== 1) {
    throw new ApolloError('Block not found', 'NOT_FOUND', {blockHash})
  }
  return facadeElasticBlock(hits.hits[0]._source)
}

export const fetchLatestBlock = async ({elastic}) => {
  const {hits} = await elastic.search({
    index: 'seiza.block',
    type: 'block',
    body: {
      query: elastic._notNull('hash'),
      sort: elastic._orderBy([['height', 'desc']]),
      size: 1,
    },
  })

  assert(hits.total >= 1)

  return facadeElasticBlock(hits.hits[0]._source)
}

export const fetchBlockBySlot = async ({elastic}, {epoch, slot}) => {
  assert(epoch != null)
  assert(slot != null)

  const {hits} = await elastic.search({
    index: 'seiza.block',
    type: 'block',
    body: {
      query: elastic._filter([
        elastic._onlyActiveFork(),
        elastic._exact('epoch', epoch),
        elastic._exact('slot', slot),
      ]),
    },
  })

  // TODO: generate only warning for total>0?
  assert(hits.total <= 1)

  // TODO: better error handling of total==0
  if (hits.total !== 1) {
    throw new ApolloError('Block not found', 'NOT_FOUND', {epoch, slot})
  }
  return facadeElasticBlock(hits.hits[0]._source)
}

export const fetchBlockTransactionIds = async (api, blockHash) => {
  const rawResult = await api.get(`blocks/txs/${blockHash}`)
  return rawResult.map((tx) => tx.ctbId)
}
