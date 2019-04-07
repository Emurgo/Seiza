import {fetchAddress} from '../address/dataProviders'
import {fetchTransaction} from '../transaction/dataProviders'
import {fetchBlockByHash} from '../block/dataProviders'

export const blockChainSearchResolver = async (root, args, context) => {
  const query = args.query

  const swallowError = (_err) => null
  const addType = (type) => (obj) => ({...obj, _type: type})

  const items = await Promise.all([
    fetchAddress(context, query)
      .then(addType('Address'))
      .catch(swallowError),
    fetchBlockByHash(context, query)
      .then(addType('Block'))
      .catch(swallowError),
    fetchTransaction(context, query)
      .then(addType('Transaction'))
      .catch(swallowError),
  ])

  return {
    items: items.filter((x) => !!x),
  }
}
