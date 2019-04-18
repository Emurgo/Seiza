import {fetchAddress} from '../address/dataProviders'
import {fetchTransaction} from '../transaction/dataProviders'
import {fetchBlockByHash, fetchBlockBySlot} from '../block/dataProviders'
import {fetchEpoch} from '../epoch/dataProviders'
import {compose} from '../utils'

const swallowError = (_err) => null

const setEntityType = (type) => (obj) => ({...obj, _type: type})

const getIntOrNull = (v) => {
  const res = parseInt(v, 10)
  return isNaN(res) ? null : res
}

const getSearchParam = (query, param, queryDivider, subqueryDivider) => {
  const splittedQuery = query.split(queryDivider)
  const paramQuery = splittedQuery.find((subQuery) =>
    subQuery.toLowerCase().startsWith(`${param}${subqueryDivider}`)
  )

  if (!paramQuery) return null

  const splittedParamQuery = paramQuery.split(subqueryDivider)

  if (splittedParamQuery.length !== 2) return null

  return splittedParamQuery[1].trim()
}

// TODO: Add assertions when we have client validation
const querySlotAndEpoch = (context, query) => {
  const queryDivider = ','
  const subqueryDivider = ':'
  const _query = compose(
    (v) => v.replace(/\s+/g, queryDivider),
    (v) => v.replace(/=/g, subqueryDivider)
  )(query)

  const epoch = getIntOrNull(getSearchParam(_query, 'epoch', queryDivider, subqueryDivider))
  const slot = getIntOrNull(getSearchParam(_query, 'slot', queryDivider, subqueryDivider))

  if (epoch != null && slot != null) {
    return fetchBlockBySlot(context, {epoch, slot})
      .then(setEntityType('Block'))
      .catch(swallowError)
  } else if (epoch != null) {
    return fetchEpoch(context, epoch)
      .then(setEntityType('Epoch'))
      .catch(swallowError)
  }

  return null
}

export const blockChainSearchResolver = async (root, args, context) => {
  const query = args.query

  const items = await Promise.all([
    querySlotAndEpoch(context, query),
    fetchAddress(context, query)
      .then(setEntityType('Address'))
      .catch(swallowError),
    fetchBlockByHash(context, query)
      .then(setEntityType('Block'))
      .catch(swallowError),
    fetchTransaction(context, query)
      .then(setEntityType('Transaction'))
      .catch(swallowError),
  ])

  return {
    items: items.filter((x) => !!x),
  }
}
