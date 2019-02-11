// @flow
import {transactionResolver} from '../transaction/resolvers'
import {facadeAddress} from './dataFacades'

import type {ApolloContext, Parent} from '../../'
import type {AddressAPIType, PartialFacadeAddress} from './dataFacades'
import type {FacadeTransaction} from '../transaction/dataFacades'
// Note: for now this always fetche all transaction data, we
// may consider optimization later if required
type AddrArgs = {
  id: string,
}

type FacadeAddress = {
  ...PartialFacadeAddress,
  transactions: Array<Promise<FacadeTransaction>>,
}

export const addressResolver = (
  parent: Parent,
  args: AddrArgs,
  context: ApolloContext
): Promise<FacadeAddress> =>
  context.cardanoAPI.get(`addresses/summary/${args.id}`).then((data: AddressAPIType) => ({
    ...facadeAddress(data),
    transactions: data.caTxList.map((transaction) =>
      transactionResolver(parent, {id: transaction.ctbId}, context)
    ),
  }))
