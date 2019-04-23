// @flow
import moment from 'moment'
import {facadeTransaction} from '../transaction/dataProviders'
import type {Elastic} from '../../api/elastic'
import {parseAdaValue} from '../utils'
import type {E} from '../../api/elasticHelpers'

type Context = {
  elastic: Elastic,
  E: E,
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
    epochNumber,
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

export const fetchBlockCount = ({elastic, E}: Context, epochNumber: number) => {
  return elastic
    .q('slot')
    .filter(E.onlyActiveFork())
    .filter(E.notNull('hash'))
    .filter(E.eq('epoch', epochNumber))
    .getCount()
}

export const fetchTransactionCount = ({elastic, E}: any, epochNumber: number) => {
  return elastic
    .q('tx')
    .filter(E.onlyActiveFork())
    .filter(E.eq('epoch', epochNumber))
    .getCount()
}

export const fetchTotalAdaSupply = async ({elastic, E}: Context, epochNumber: number) => {
  // fetch last tx before end of this epoch

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
  const aggregations = await elastic
    .q('tx')
    .filter(E.onlyActiveFork())
    .filter(E.eq('epoch', epochNumber))
    .getAggregations({
      fees: E.agg.sumAda('fees'),
    })

  return parseAdaValue(aggregations.fees)
}
