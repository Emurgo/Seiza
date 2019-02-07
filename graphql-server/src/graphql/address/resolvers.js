import {transactionResolver} from '../transaction/resolvers'
import {facadeAddress} from './dataFacades'

// Note: for now this always fetche all transaction data, we
// may consider optimization later if required

export const addressResolver = (parent, args, context) =>
  context.cardanoAPI.get(`addresses/summary/${args.id}`).then((data) => ({
    ...facadeAddress(data),
    transactions: data.caTxList.map((transaction) =>
      transactionResolver(parent, {id: transaction.ctbId}, context)
    ),
  }))
