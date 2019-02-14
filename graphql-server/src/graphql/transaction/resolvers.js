// @flow
import {facadeTransaction} from './dataFacades'
import {currentStatusResolver} from '../status/resolvers'
import type {ApolloContext, Parent} from '../../'
import type {FacadeTransaction} from './dataFacades'

type TxResolverArgs = {
  txHash: string,
}

export const transactionResolver = async (
  parent: Parent,
  args: TxResolverArgs,
  context: ApolloContext
): Promise<FacadeTransaction> => {
  const getTxData = () => context.cardanoAPI.get(`txs/summary/${args.txHash}`)
  const transaction = await getTxData().then(facadeTransaction)

  const getConfirmationsCountResolver = (transaction) => async () => {
    const blockchainHeight = await currentStatusResolver(parent, null, context).blockCount()
    return blockchainHeight - transaction.blockHeight
  }

  return {
    ...transaction,
    confirmationsCount: getConfirmationsCountResolver(transaction),
  }
}
