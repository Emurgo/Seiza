import {transactionResolver} from '../transaction/resolvers'

// Note: for now this always fetche all transaction data, we
// may consider optimization later if required

export const addressResolver = (parent, args, context) =>
  context.cardanoAPI.get(`addresses/summary/${args.id}`).then(({data}) => {
    const d = data.Right
    return {
      id: d.caAddress,
      type: d.caType,
      transactionsCount: d.caTxNum,
      balance: d.caBalance.getCoin,
      transactions: d.caTxList.map((transaction) =>
        transactionResolver(parent, {id: transaction.ctbId}, context)
      ),
    }
  })
