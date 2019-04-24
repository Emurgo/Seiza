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
      const res2 = await slots.getAggregations({txNum: E.agg.sum('tx_num')})

      assert.equal(res1, res2.txNum)
      return res1
    },
    movements: () =>
      slots
        .getAggregations({
          sent: E.agg.sumAda('sent'),
        })
        .then(({sent}) => sent)
        .then(parseAdaValue),
    totalFees: () =>
      slots
        .getAggregations({
          fees: E.agg.sumAda('fees'),
        })
        .then(({fees}) => fees)
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
    sent: E.agg.sumAda('sent'),
    fees: E.agg.sumAda('fees'),
    txCount: E.agg.sum('tx_num'),
    // Note: we cannot count on hash
    blocks: E.agg.countNotNull('hash.keyword'),
    slotsMissed: E.agg.raw({missing: {field: 'hash.keyword'}}),
  })

  return {
    blocksCount: async () => {
      const cnt = (await aggregations).blocks
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
    movements: aggregations.then(({sent}) => sent).then(parseAdaValue),
    totalFees: aggregations.then(({fees}) => fees).then(parseAdaValue),
    txCount: async () => {
      const cnt = (await aggregations).txCount

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

// TODO: (refactor) directly use `fetchBlockBySlot`?
export const fetchSlotInfo = (context: any, epoch: number, slot: number) => {
  return fetchBlockBySlot(context, {epoch, slot}).then((block) => ({
    __epoch_slot: {epoch, slot},
    txCount: block.transactionsCount,
    totalSent: block.totalSent,
    totalFees: block.totalFees,
    timeIssued: block.timeIssued,
  }))
}
