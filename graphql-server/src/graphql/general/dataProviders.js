// @flow
import {fetchBlockBySlot} from '../block/dataProviders'
import moment from 'moment'
import assert from 'assert'
import {parseAdaValue} from '../utils'

// TODO: unify properties naming with the rest endpoints once the final fields are determined
export type GeneralInfo = {|
  blocksCount: number,
  txCount: number,
  movements: string,
  totalFees: string,
  emptySlotsCount: number,
  addresses: string,
|}

export type EpochInfo = GeneralInfo
export const fetchGeneralInfo = ({elastic, E}: any, period: string) => {
  const since =
    period === 'LAST_24_HOURS'
      ? moment()
        .subtract(1, 'days')
        .toISOString()
      : null

  const slots = elastic
    .q('slot')
    .filter(E.onlyActiveFork())
    .filter(since && E.gte('time', since))

  const txs = elastic
    .q('tx')
    .filter(E.onlyActiveFork())
    .filter(since && E.gte('time', since))

  return {
    blocksCount: () => slots.filter(E.notNull('hash')).getCount(),
    txCount: async () => {
      const res1 = await txs.getCount()
      const res2 = await slots.getAggregations({txNum: E.sum('tx_num')})

      assert.equal(res1, res2.txNum.value)
      return res1
    },
    movements: () =>
      slots
        .getAggregations(E.sumAda('sent'))
        .then((agg) => E.extractSumAda(agg, 'sent'))
        .then(parseAdaValue),
    totalFees: () =>
      slots
        .getAggregations(E.sumAda('fees'))
        .then((agg) => E.extractSumAda(agg, 'fees'))
        .then(parseAdaValue),
    addresses: () => -1,
    emptySlotsCount: () => slots.filter(E.isNull('hash')).getCount(),
  }
}

export const fetchEpochInfo = ({elastic, E}: any, epoch: number) => {
  const slots = elastic
    .q('slot')
    .filter(E.onlyActiveFork())
    .filter(E.eq('epoch', epoch))

  const aggregations = slots.getAggregations({
    ...E.sumAda('sent'),
    ...E.sumAda('fees'),
    txCount: E.sum('tx_num'),
    blocks: {value_count: {field: 'hash.keyword'}},
    slotsMissed: {missing: {field: 'hash.keyword'}},
  })

  return {
    blocksCount: async () => {
      const cnt = (await aggregations).blocks.value
      // (expensive) sanity check
      assert.equal(cnt, await slots.filter(E.notNull('hash')).getCount())
      return cnt
    },
    emptySlotsCount: async () => {
      // Grr, elastic is just plain weird. Every other aggregation is .value
      const cnt = (await aggregations).slotsMissed.doc_count
      // (expensive) sanity check
      assert.equal(cnt, await slots.filter(E.isNull('hash')).getCount())
      return cnt
    },
    movements: aggregations.then((agg) => E.extractSumAda(agg, 'sent')).then(parseAdaValue),
    totalFees: aggregations.then((agg) => E.extractSumAda(agg, 'fees')).then(parseAdaValue),
    txCount: async () => {
      const cnt = (await aggregations).txCount.value

      // (expensive) sanity check
      assert.equal(
        cnt,
        await elastic
          .q('tx')
          .filter(E.onlyActiveFork())
          .filter(E.eq('epoch', epoch))
          .getCount()
      )
      return cnt
    },
    addresses: -1,
  }
}

export const fetchSlotInfo = (context: any, epoch: number, slot: number) => {
  return fetchBlockBySlot(context, {epoch, slot}).then((block) => ({
    __epoch_slot: {epoch, slot},
    txCount: block.transactionsCount,
    totalSent: block.totalSend,
    totalFees: block.totalFees,
  }))
}
