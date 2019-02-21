export const currentStatusResolver = (root, args, context) => {
  const epochNumberResolver = () =>
    context.cardanoAPI.get('blocks/pages').then((response) => response[1][0].cbeEpoch)

  // TODO: this turn this into blocks once we have that info
  const blockCountResolver = () =>
    context.cardanoAPI.get('blocks/pages').then((response) => response[1][0].cbeSlot)

  // TODO: get this info
  const decentralizationResolver = () => 0

  // TODO: get this info
  const priceResolver = () => ({
    usd: 0.031,
    eur: 0.042,
  })

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
