// @flow
import {fetchGeneralInfo, fetchSlotInfo, fetchEpochInfo} from './dataProviders'
import {parseAdaValue} from '../utils'
import assert from 'assert'

const fetchSupplyAfterSlot = async ({elastic, E}, {epoch, slot}) => {
  const hit = await elastic
    .q('tx')
    .filter(E.lte('epoch', epoch))
    .filter(E.lte('slot', slot))
    .sortBy('epoch', 'desc')
    .sortBy('slot', 'desc')
    .sortBy('tx_ordinal', 'desc')
    .getFirstHit()

  return parseAdaValue(hit._source.supply_after_this_tx)
}

const fetchTxCountGraph = async ({elastic, E}) => {
  const aggByEpoch = (defs) => ({
    encode: () => ({
      terms: {
        field: 'epoch',
        size: 10000,
        show_term_doc_count_error: true,
      },
      aggs: E.agg._encode(defs),
    }),
    decode: (x) =>
      x.buckets.map((bucket) => {
        assert(bucket.doc_count_error_upper_bound === 0)
        return {
          key: bucket.key,
          ...E.agg._decode(defs, bucket),
        }
      }),
  })

  const filterRecent = (since, defs) => ({
    encode: () => ({
      filter: E.gte('time', since),
      aggs: E.agg._encode(defs),
    }),
    decode: (x) => E.agg._decode(defs, x),
  })

  const aggByDay = (since, defs) => ({
    encode: () => ({
      filter: E.gte('time', since),
      aggs: {
        __filtered: {
          date_histogram: {
            field: 'time',
            format: 'yyyy-MM-dd',
            interval: '1d',
            min_doc_count: 0,
            extended_bounds: {
              max: 'now',
              min: since,
            },
          },
          aggs: E.agg._encode(defs),
        },
      },
    }),
    decode: (x) =>
      x.__filtered.buckets.map((bucket) => {
        return {
          key: bucket.key_as_string,
          ...E.agg._decode(defs, bucket),
        }
      }),
  })

  const since = 'now-549d/d'

  const aggs = await elastic.q('slot').getAggregations({
    byDay: aggByDay(since, {
      txCount: E.agg.sum('tx_num'),
    }),
  })

  return {
    data: aggs.byDay.map(({key, txCount}) => ({
      x: key,
      y: txCount,
    })),
  }
}

export default {
  Query: {
    generalInfo: (root: any, args: any, context: any) => fetchGeneralInfo(context, args.infoPeriod),
    epochInfo: (root: any, args: any, context: any) => fetchEpochInfo(context, args.epoch),
    slotInfo: (root: any, args: any, context: any) => fetchSlotInfo(context, args.epoch, args.slot),
    txCountGraph: (root: any, args: any, context: any) => fetchTxCountGraph(context),
  },
  SlotInfo: {
    supply: (slotInfo: any, args: any, context: any) =>
      fetchSupplyAfterSlot(context, slotInfo.__epoch_slot),
  },
}
