import {facadeTransaction} from './dataFacades'

export const transactionResolver = (parent, args, context) =>
  context.cardanoAPI.get(`txs/summary/${args.id}`).then(facadeTransaction)
