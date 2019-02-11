// @flow
import {facadeTransaction} from './dataFacades'

import type {ApolloContext} from '../../'

type TxResolverArgs = {
  id: string,
}

export const transactionResolver = (parent, args: TxResolverArgs, context: ApolloContext) =>
  context.cardanoAPI.get(`txs/summary/${args.id}`).then(facadeTransaction)
