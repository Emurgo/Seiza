// @flow
import {fetchBlockBySlot} from '../block/dataProviders'
import moment from 'moment'
import {parseAdaValue, runConsistencyCheck, validate} from '../utils'
import E from '../../api/elasticHelpers'

// TODO: unify properties naming with the rest endpoints once the final fields are determined
export type GeneralInfo = {|
  blocksCount: number,
  txCount: number,
  movements: string,
  totalFees: string,
  emptySlotsCount: number,
  activeAddresses: string,
|}

const _getGeneralInfo = ({elastic}, {slots, txs, addresses, txios}, ctxToLog) => {
  const slotAggregations = elastic.q(slots).getAggregations({
    sent: E.agg.sumAda('sent'),
    fees: E.agg.sumAda('fees'),
    txCount: E.agg.sum('tx_num'),
    // Note: we cannot count on hash
    blocks: E.agg.countNotNull('hash.keyword'),
    slotsMissed: E.agg.countNull('hash.keyword'),
  })

  const blocksCount = async () => {
    const cnt = (await slotAggregations).blocks

    // (expensive) sanity check
    await runConsistencyCheck(async () => {
      const tmp = await elastic
        .q(slots)
        .filter(E.onlyActiveFork())
        .filter(E.notNull('hash'))
        .getCount()

      validate(cnt === tmp, 'GeneralInfo.blocksCount inconsistency', {
        cnt_viaSlotsAgg: cnt,
        cnt_viaSlotsCnt: tmp,
        ...ctxToLog,
      })
    })

    return cnt
  }

  const emptySlotsCount = async () => {
    const cnt = (await slotAggregations).slotsMissed

    // (expensive) sanity check
    await runConsistencyCheck(async () => {
      const tmp = await elastic
        .q(slots)
        .filter(E.onlyActiveFork())
        .filter(E.isNull('hash'))
        .getCount()

      validate(cnt === tmp, 'GeneralInfo.emptySlotsCount inconsistency', {
        cnt_viaSlotAgg: cnt,
        cnt_viaSlotCnt: tmp,
        ...ctxToLog,
      })
    })

    return cnt
  }

  const txCount = async () => {
    const cnt = (await slotAggregations).txCount

    // (expensive) sanity check
    await runConsistencyCheck(async () => {
      const tmp = await elastic.q(txs).getCount()
      validate(cnt === tmp, 'GeneralInfo.txCount inconsistency', {
        cnt_viaSlotAgg: cnt,
        cnt_viaTxCnt: tmp,
        ...ctxToLog,
      })
    })

    return cnt
  }

  const activeAddresses = async () => {
    const precise = await elastic.q(addresses).getCount()

    // (expensive) sanity check
    await runConsistencyCheck(async () => {
      // allow up to 1% difference
      const threshold = 0.01
      const approx = await elastic
        .q(txios)
        .getAggregations({
          addresses: E.agg.countDistinctApprox('address.keyword'),
        })
        .then(({addresses}) => addresses)

      validate(
        Math.abs((approx - precise) / (precise + 1e-6)) <= threshold,
        'GeneralInfo.activeAddresses inconsistency',
        {
          precise_viaAddressesCnt: precise,
          approx_viaTxioAgg: approx,
          ...ctxToLog,
        }
      )
    })

    return precise
  }

  return {
    blocksCount,
    emptySlotsCount,
    movements: slotAggregations.then(({sent}) => parseAdaValue(sent)),
    totalFees: slotAggregations.then(({fees}) => parseAdaValue(fees)),
    txCount,
    activeAddresses,
  }
}

export type EpochInfo = GeneralInfo

const generalInfoQ = (since) => ({
  txs: E.q('tx')
    .filter(E.onlyActiveFork())
    .filter(since && E.gte('time', since)),
  txios: E.q('txio')
    .filter(E.onlyActiveFork())
    .filter(since && E.gte('time', since)),
  slots: E.q('slot')
    .filter(E.onlyActiveFork())
    .filter(since && E.gte('time', since)),
  addresses: E.q('address').filter(since && E.gte('ios.time', since)),
})

export const fetchGeneralInfo = (context: any, period: string) => {
  const since =
    period === 'LAST_24_HOURS'
      ? moment()
        .subtract(1, 'days')
        .toISOString()
      : null

  return _getGeneralInfo(context, generalInfoQ(since), {period})
}

const epochInfoQ = (epoch) => ({
  txs: E.q('tx')
    .filter(E.onlyActiveFork())
    .filter(E.eq('epoch', epoch)),
  txios: E.q('txio')
    .filter(E.onlyActiveFork())
    .filter(E.eq('epoch', epoch)),
  slots: E.q('slot')
    .filter(E.onlyActiveFork())
    .filter(E.eq('epoch', epoch)),
  addresses: E.q('address').filter(E.eq('ios.epoch', epoch)),
})

export const fetchEpochInfo = (context: any, epoch: number) => {
  return _getGeneralInfo(context, epochInfoQ(epoch), {epoch})
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
