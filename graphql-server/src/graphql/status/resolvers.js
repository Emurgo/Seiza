import {fetchLatestBlock} from '../block/dataProviders'

const fetchCurrentPrice = async ({pricingAPI}, currency) => {
  const result = await pricingAPI.get('price', {fsym: 'ADA', tsyms: currency})

  return result[currency]
}

export const currentStatusResolver = (root, args, context) => {
  const epochNumberResolver = () => fetchLatestBlock(context).then((block) => block.epoch)

  const blockCountResolver = () => fetchLatestBlock(context).then((block) => block.slot)

  // TODO: get this info
  const decentralizationResolver = () => 0

  // TODO: get this info
  const priceResolver = (args, context) => fetchCurrentPrice(context, args.currency)

  // TODO: get this info
  const stakePoolCountResolver = () => null

  return {
    epochNumber: epochNumberResolver,
    blockCount: blockCountResolver,
    decentralization: decentralizationResolver,
    price: priceResolver,
    stakePoolCount: stakePoolCountResolver,
  }
}
