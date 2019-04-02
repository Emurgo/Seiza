// @flow
import moment from 'moment'
import assert from 'assert'
import {facadeElasticTransaction} from '../transaction/dataProviders'

type Summary = {
  slotCount: number,
  // Resolved separately:
  //  blocksCreated: number,
  //  transactionCount: number,
  //  totalAdaSupply: string,
  //  epochFees: string,
  totalAdaStaked: string,
  stakingRewards: string,
  delegatingStakingKeysCount: number,
  activeStakingPoolCount: number,
}
type Epoch = {
  startTime: Object,
  endTime: Object,
  progress: number,
  summary: Summary,
}

const mockedEpoch = (epochNumber: number): Epoch => {
  const slotCount = 21600
  const slotDuration = 20
  // Note(ppershing): not sure why it started at such weird (not modulo 20) timestamp
  const startTs = 1506203091 + slotCount * slotDuration * epochNumber
  const endTs = startTs + slotCount * slotDuration

  const currentTs = moment().unix()
  const progress =
    currentTs <= startTs ? 0 : currentTs >= endTs ? 1 : (currentTs - startTs) / (endTs - startTs)

  return {
    startTime: moment(startTs * 1000),
    endTime: moment(endTs * 1000),
    progress,
    summary: {
      _epochNumber: epochNumber,
      slotCount,
      totalAdaStaked: '123456',
      stakingRewards: '123456',
      delegatingStakingKeysCount: 123456,
      activeStakingPoolCount: 123,
    },
  }
}

export const fetchEpoch = (context: any, epochNumber: number): Promise<Epoch> => {
  return Promise.resolve(mockedEpoch(epochNumber))
}

export const fetchBlockCount = async ({elastic}: any, epochNumber: number) => {
  const {
    hits: {total},
  } = await elastic.search({
    index: 'seiza.block',
    type: 'block',
    body: {
      query: elastic._filter([
        elastic._onlyActiveFork(),
        elastic._notNull('hash'),
        elastic._exact('epoch', epochNumber),
      ]),
      size: 0,
    },
  })
  return total
}

export const fetchTransactionCount = async ({elastic}: any, epochNumber: number) => {
  const {
    hits: {total},
  } = await elastic.search({
    index: 'seiza.tx',
    type: 'tx',
    body: {
      query: elastic._filter([elastic._onlyActiveFork(), elastic._exact('epoch', epochNumber)]),
      size: 0,
    },
  })
  return total
}

export const fetchTotalAdaSupply = async ({elastic}: any, epochNumber: number) => {
  // fetch last tx before end of this epoch

  const {hits} = await elastic.search({
    index: 'seiza.tx',
    type: 'tx',
    body: {
      query: elastic._filter([elastic._onlyActiveFork(), elastic._lte('epoch', epochNumber)]),
      sort: elastic._orderBy([['epoch', 'desc'], ['slot', 'desc'], ['tx_ordinal', 'desc']]),
      size: 1,
    },
  })

  assert(hits.total >= 1)
  const lastTx = facadeElasticTransaction(hits.hits[0]._source)

  return lastTx.supplyAfter
}

export const fetchTotalFees = async ({elastic}: any, epochNumber: number) => {
  const {aggregations} = await elastic.search({
    index: 'seiza.tx',
    type: 'tx',
    body: {
      query: elastic._filter([elastic._onlyActiveFork(), elastic._exact('epoch', epochNumber)]),
      size: 0,
      aggs: {
        fees: elastic._sum('fees'),
      },
    },
  })

  return aggregations.fees.value
}
