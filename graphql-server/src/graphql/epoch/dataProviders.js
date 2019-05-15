// @flow
import moment from 'moment'
import {facadeTransaction} from '../transaction/dataProviders'
import type {Elastic} from '../../api/elastic'
import {parseAdaValue, runConsistencyCheck, validate, slotCount, getEstimatedSlotTimestamp} from '../utils'
import E from '../../api/elasticHelpers'

type Context = {
  elastic: Elastic,
  E: typeof E,
}

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
  summary: Summary,
}

const mockedEpoch = (epochNumber: number): Epoch => {
  const startTs = getEstimatedSlotTimestamp(epochNumber, 0)
  const endTs = getEstimatedSlotTimestamp(epochNumber + 1, 0)

  return {
    epochNumber,
    startTime: moment(startTs * 1000),
    endTime: moment(endTs * 1000),
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

const epochBlocks = (epochNumber) =>
  E.q('slot')
    .filter(E.onlyActiveFork())
    .filter(E.notNull('hash'))
    .filter(E.eq('epoch', epochNumber))

const epochTxs = (epochNumber) =>
  E.q('tx')
    .filter(E.onlyActiveFork())
    .filter(E.eq('epoch', epochNumber))

export const fetchBlockCount = ({elastic, E}: Context, epochNumber: number) => {
  return elastic.q(epochBlocks(epochNumber)).getCount()
}

export const fetchTransactionCount = async ({elastic, E}: any, epochNumber: number) => {
  const txCount = await elastic.q(epochTxs(epochNumber)).getCount()

  await runConsistencyCheck(async () => {
    const tmpCnt = await elastic
      .q(epochBlocks(epochNumber))
      .getAggregations({
        cnt: E.agg.sum('tx_num'),
      })
      // eslint-disable-next-line camelcase
      .then(({tx_num}) => tx_num)
    validate(tmpCnt === txCount, 'TxCount inconsistency on epoch', {
      fromTxs: txCount,
      fromBlocks: tmpCnt,
    })
  })
  return txCount
}

export const fetchTotalAdaSupply = async ({elastic, E}: Context, epochNumber: number) => {
  // fetch last tx before end of this epoch

  // Note(ppershing): in order to support *future* epochs, we use
  // lte instead of eq!
  const hit = await elastic
    .q('tx')
    .filter(E.onlyActiveFork())
    .filter(E.lte('epoch', epochNumber))
    .sortBy('epoch', 'desc')
    .sortBy('tx_ordinal', 'desc')
    .getFirstHit()

  const lastTx = facadeTransaction(hit._source)

  return lastTx.supplyAfter
}

export const fetchTotalFees = async ({elastic, E}: Context, epochNumber: number) => {
  const aggregations = await elastic.q(epochTxs(epochNumber)).getAggregations({
    fees: E.agg.sumAda('fees'),
  })

  const fees = parseAdaValue(aggregations.fees)

  await runConsistencyCheck(async () => {
    const tmp = await elastic.q(epochBlocks(epochNumber)).getAggregations({
      fees: E.agg.sumAda('fees'),
    })

    validate(fees.eq(parseAdaValue(tmp.fees)), 'Fees inconsistency on epoch', {
      fromTxs: aggregations.fees,
      fromBlocks: tmp,
    })
  })

  return fees
}
