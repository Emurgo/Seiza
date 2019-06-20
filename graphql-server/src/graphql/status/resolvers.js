import {fetchLatestBlock} from '../block/dataProviders'

import moment from 'moment'

const fetchCurrentPrice = async ({pricingAPI}, currency) => {
  const result = await pricingAPI.get('price', {
    fsym: 'ADA',
    tsyms: currency,
  })

  return result[currency]
}

export const fetchCurrentSyncTime = (context) => {
  const {E, elastic} = context

  return elastic
    .q('slot')
    .filter(E.onlyActiveFork())
    .getAggregations({
      time: E.agg.max('time'),
    })
    .then(({time}) => moment(time))
}

export const currentStatusResolver = (root, args, context) => {
  const latestBlockResolver = () => fetchLatestBlock(context)

  const epochNumberResolver = () => latestBlockResolver().then((block) => block.epoch)

  const blockCountResolver = () => latestBlockResolver().then((block) => block.slot)

  // TODO: get this info
  const decentralizationResolver = () => 0

  // TODO: get this info
  const priceResolver = (args, context) => fetchCurrentPrice(context, args.currency)

  // TODO: get this info
  const stakePoolCountResolver = () => null

  const dataAvailableUpToResolver = () => fetchCurrentSyncTime(context)

  return {
    epochNumber: epochNumberResolver,
    blockCount: blockCountResolver,
    latestBlock: latestBlockResolver,
    decentralization: decentralizationResolver,
    price: priceResolver,
    stakePoolCount: stakePoolCountResolver,
    dataAvailableUpTo: dataAvailableUpToResolver,
    currentTime: moment(),
  }
}
