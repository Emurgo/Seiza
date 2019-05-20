// @flow
import _ from 'lodash'
import {fetchGeneralInfo, fetchSlotInfo, fetchEpochInfo} from './dataProviders'
import {parseAdaValue, validate, runConsistencyCheck} from '../utils'
import assert from 'assert'

const fetchSupplyAfterSlot = async ({elastic, E}, {epoch, slot}) => {
  const hit = await elastic
    .q('tx')
    .filter(E.onlyActiveFork())
    .filter(E.lte('epoch', epoch))
    .filter(E.lte('slot', slot))
    .sortBy('epoch', 'desc')
    .sortBy('slot', 'desc')
    .sortBy('tx_ordinal', 'desc')
    .getFirstHit()

  return parseAdaValue(hit._source.supply_after_this_tx)
}

const aggByEpoch = (E, {from, to}, defs) => ({
  encode: () => ({
    filter: E.filter([from && E.gte('epoch', from), to && E.lte('epoch', to)]),
    aggs: {
      __filtered: {
        terms: {
          field: 'epoch',
          size: 10000,
          show_term_doc_count_error: true,
          order: {_key: 'asc'},
        },
        aggs: E.agg._encode(defs),
      },
    },
  }),
  decode: (x) =>
    x.__filtered.buckets.map((bucket) => {
      assert(bucket.doc_count_error_upper_bound === 0)
      return {
        key: bucket.key,
        ...E.agg._decode(defs, bucket),
      }
    }),
})

const aggByDay = (E, {from, to}, defs) => ({
  encode: () => {
    const dayInMs = 1000 * 60 * 60 * 24
    from && assert(from.valueOf() % dayInMs === 0)
    to && assert(to.valueOf() % dayInMs === 0)
    return {
      filter: E.filter([
        from && E.gte('time', from.valueOf()),
        to && E.lt('time', to.valueOf() + dayInMs),
      ]),
      aggs: {
        __filtered: {
          date_histogram: {
            field: 'time',
            format: 'yyyy-MM-dd',
            interval: '1d',
            // Note: not using `extended_bounds` intentionally,
            // we show data only from time we have them
          },
          aggs: E.agg._encode(defs),
        },
      },
    }
  },
  decode: (x) =>
    x.__filtered.buckets.map((bucket) => {
      return {
        key: bucket.key_as_string,
        ...E.agg._decode(defs, bucket),
      }
    }),
})

const fetchAggregateInfo = ({elastic, E}, groupBy, epochInterval = {}, dateInterval = {}) => {
  const wrapInGroupBy = (defs) => {
    return {
      DAY: aggByDay(E, dateInterval, defs),
      EPOCH: aggByEpoch(E, epochInterval, defs),
    }[groupBy]
  }

  const prepareSeries = (res, transform) => ({
    data: res.map(({key, rawY}) => ({
      x: key,
      y: transform(rawY),
    })),
  })

  return {
    totalAdaTransferred: () =>
      elastic
        .q('slot')
        .filter(E.onlyActiveFork())
        .getAggregations({
          data: wrapInGroupBy({
            rawY: E.agg.sumAda('sent'),
          }),
        })
        .then(({data}) => prepareSeries(data, (y) => parseAdaValue(y).toNumber())),

    txCount: () =>
      elastic
        .q('slot')
        .filter(E.onlyActiveFork())
        .getAggregations({
          data: wrapInGroupBy({
            rawY: E.agg.sum('tx_num'),
          }),
        })
        .then(({data}) => prepareSeries(data, (y) => y)),

    totalUtxoCreated: async () => {
      const res1 = await elastic
        .q('tx')
        .filter(E.onlyActiveFork())
        .getAggregations({
          data: wrapInGroupBy({
            rawY: E.agg.count('outputs.id.keyword'),
          }),
        })

      await runConsistencyCheck(async () => {
        const res2 = await elastic
          .q('txio')
          .filter(E.onlyActiveFork())
          .filter(E.matchPhrase('type', 'output'))
          .getAggregations({
            data: wrapInGroupBy({
              rawY: E.agg.count('id.keyword'),
            }),
          })

        const res3 = await elastic
          .q('slot')
          .filter(E.onlyActiveFork())
          .getAggregations({
            data: wrapInGroupBy({
              rawY: E.agg.count('tx.outputs.id.keyword'),
            }),
          })

        validate(
          _.isEqual(res1, res2) && _.isEqual(res1, res3),
          '`Total UTXO created` inconsistency',
          {
            viaTx: res1,
            viaTxio: res2,
            viaSlot: res3,
          }
        )
      })

      return prepareSeries(res1.data, (y) => y)
    },
  }
}

export default {
  Query: {
    generalInfo: (root: any, args: any, context: any) => fetchGeneralInfo(context, args.infoPeriod),
    epochInfo: (root: any, args: any, context: any) => fetchEpochInfo(context, args.epoch),
    slotInfo: (root: any, args: any, context: any) => fetchSlotInfo(context, args.epoch, args.slot),
    aggregateInfo: (root: any, args: any, context: any) =>
      fetchAggregateInfo(context, args.groupBy, args.epochInterval, args.dateInterval),
  },
  SlotInfo: {
    supply: (slotInfo: any, args: any, context: any) =>
      fetchSupplyAfterSlot(context, slotInfo.__epoch_slot),
  },
}
