import axios from 'axios'

const fetchCurrentPrice = async (api, currency) => {
  const url = `https://min-api.cryptocompare.com/data/price?fsym=ADA&tsyms=${currency}`
  const result = await axios.get(url)
  return result.data[currency]
}

export const currentStatusResolver = (root, args, context) => {
  const epochNumberResolver = () =>
    context.cardanoAPI.get('blocks/pages').then((response) => response[1][0].cbeEpoch)

  // TODO: this turn this into blocks once we have that info
  const blockCountResolver = () =>
    context.cardanoAPI.get('blocks/pages').then((response) => response[1][0].cbeSlot)

  // TODO: get this info
  const decentralizationResolver = () => 0

  // TODO: get this info
  const priceResolver = (args, context) => {
    return fetchCurrentPrice(null, args.currency)
  }

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
