// @flow
import {facadeTransaction} from './dataFacades'

import type {ApolloContext, Parent} from '../../'
import type {FacadeTransaction} from './dataFacades'

type TxResolverArgs = {
  txHash: string,
}

export const transactionResolver = (
  parent: Parent,
  args: TxResolverArgs,
  context: ApolloContext
): Promise<FacadeTransaction> =>
  context.cardanoAPI.get(`txs/summary/${args.txHash}`).then(facadeTransaction)
