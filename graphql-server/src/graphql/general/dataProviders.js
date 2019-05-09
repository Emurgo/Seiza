// @flow
import {fetchBlockBySlot} from '../block/dataProviders'
import moment from 'moment'
import assert from 'assert'
import {parseAdaValue, runConsistencyCheck} from '../utils'

// TODO: unify properties naming with the rest endpoints once the final fields are determined
export type GeneralInfo = {|
  blocksCount: number,
  txCount: number,
  movements: string,
  totalFees: string,
  emptySlotsCount: number,
  activeAddresses: string,
|}

const _getGeneralInfo = ({q, E}) => {
  const aggregations = q.slots.getAggregations({
    sent: E.agg.sumAda('sent'),
    fees: E.agg.sumAda('fees'),
    txCount: E.agg.sum('tx_num'),
    // Note: we cannot count on hash
    blocks: E.agg.countNotNull('hash.keyword'),
    slotsMissed: E.agg.countNull('hash.keyword'),
  })

  const blocksCount = async () => {
    const cnt = (await aggregations).blocks

    // (expensive) sanity check
    await runConsistencyCheck(async () => {
      assert.equal(cnt, await q.slots.filter(E.notNull('hash')).getCount())
    })

    return cnt
  }

  const emptySlotsCount = async () => {
    const cnt = (await aggregations).slotsMissed

    // (expensive) sanity check
    await runConsistencyCheck(async () => {
      assert.equal(cnt, await q.slots.filter(E.isNull('hash')).getCount())
    })

    return cnt
  }

  const txCount = async () => {
    const cnt = (await aggregations).txCount

    // (expensive) sanity check
    await runConsistencyCheck(async () => {
      assert.equal(cnt, await q.txs.getCount())
    })

    return cnt
  }

  const activeAddresses = async () => {
    const precise = await q.addresses.getCount()

    // (expensive) sanity check
    await runConsistencyCheck(async () => {
      // allow up to 1% difference
      const threshold = 0.01
      const approx = await q.txios
        .getAggregations({
          addresses: E.agg.countDistinctApprox('address.keyword'),
        })
        .then(({addresses}) => addresses)

      assert(Math.abs((approx - precise) / (precise + 1e-6)) <= threshold)
    })

    return precise
  }

  return {
    blocksCount,
    emptySlotsCount,
    movements: aggregations.then(({sent}) => parseAdaValue(sent)),
    totalFees: aggregations.then(({fees}) => parseAdaValue(fees)),
    txCount,
    activeAddresses,
  }
}

export type EpochInfo = GeneralInfo
export const fetchGeneralInfo = ({elastic, E}: any, period: string) => {
  const since =
    period === 'LAST_24_HOURS'
      ? moment()
        .subtract(1, 'days')
        .toISOString()
      : null

  const q = {
    txs: elastic
      .q('tx')
      .filter(E.onlyActiveFork())
      .filter(since && E.gte('time', since)),
    txios: elastic
      .q('txio')
      .filter(E.onlyActiveFork())
      .filter(since && E.gte('time', since)),
    slots: elastic
      .q('slot')
      .filter(E.onlyActiveFork())
      .filter(since && E.gte('time', since)),
    addresses: elastic.q('address').filter(since && E.gte('ios.time', since)),
  }

  return _getGeneralInfo({q, E})
}

export const fetchEpochInfo = ({elastic, E}: any, epoch: number) => {
  const q = {
    txs: elastic
      .q('tx')
      .filter(E.onlyActiveFork())
      .filter(E.eq('epoch', epoch)),
    txios: elastic
      .q('txio')
      .filter(E.onlyActiveFork())
      .filter(E.eq('epoch', epoch)),
    slots: elastic
      .q('slot')
      .filter(E.onlyActiveFork())
      .filter(E.eq('epoch', epoch)),
    addresses: elastic.q('address').filter(E.eq('ios.epoch', epoch)),
  }
  return _getGeneralInfo({q, E})
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
