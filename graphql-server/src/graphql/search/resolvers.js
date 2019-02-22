import {fetchAddress} from '../address/dataProviders'
import {fetchTransaction} from '../transaction/dataProviders'
import {fetchBlockSummary} from '../block/dataProviders'

export const blockChainSearchResolver = async (root, args, context) => {
  const query = args.query

  const swallowError = (_err) => null
  const addType = (type) => (obj) => ({...obj, _type: type})

  const items = await Promise.all([
    fetchAddress(context.cardanoAPI, query)
      .then(addType('Address'))
      .catch(swallowError),
    fetchBlockSummary(context.cardanoAPI, query)
      .then(addType('Block'))
      .catch(swallowError),
    fetchTransaction(context.cardanoAPI, query)
      .then(addType('Transaction'))
      .catch(swallowError),
  ])

  return {
    items: items.filter((x) => !!x),
  }
}
