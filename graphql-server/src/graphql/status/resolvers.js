const fetchCurrentPrice = async ({pricingAPI}, currency) => {
  const result = await pricingAPI.get('price', {fsym: 'ADA', tsyms: currency})

  return result[currency]
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
