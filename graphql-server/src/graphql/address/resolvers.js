// @flow
import {transactionResolver} from '../transaction/resolvers'
import {facadeAddress} from './dataFacades'

import type {ApolloContext} from '../../'
import type {AddressAPIType} from './dataFacades'
// Note: for now this always fetche all transaction data, we
// may consider optimization later if required
type AddrArgs = {
  id: string,
}

export const addressResolver = (parent, args: AddrArgs, context: ApolloContext) =>
  context.cardanoAPI.get(`addresses/summary/${args.id}`).then((data: AddressAPIType) => ({
    ...facadeAddress(data),
    transactions: data.caTxList.map((transaction) =>
      transactionResolver(parent, {id: transaction.ctbId}, context)
    ),
  }))
