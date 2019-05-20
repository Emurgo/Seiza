// @flow
import assert from 'assert'
import {parseAdaValue, annotateNotFoundError, runConsistencyCheck, validate} from '../utils'
import E from '../../api/elasticHelpers'

export const facadeTransaction = (source: any) => {
  return {
    txHash: source.hash,
    _epoch_slot: {epoch: source.epoch, slot: source.slot},
    totalInput: parseAdaValue(source.sum_inputs),
    totalOutput: parseAdaValue(source.sum_outputs),
    // TODO: what about refunds?
    fees: parseAdaValue(source.fees),

    // TODO: this is a hack for now
    inputs: source.inputs.map((input) => ({
      address58: input.address,
      amount: parseAdaValue(input.value),
    })),
    outputs: source.outputs.map((output) => ({
      address58: output.address,
      amount: parseAdaValue(output.value),
    })),

    // TODO: tx size is missing in data
    size: null,
    supplyAfter: parseAdaValue(source.supply_after_this_tx),
  }
}

export const fetchTransaction = async ({elastic, E}: any, txHash: string) => {
  const hit = await elastic
    .q('tx')
    // todo: filter on active fork?
    .filter(E.matchPhrase('hash', txHash))
    .getSingleHit()
    .catch(annotateNotFoundError({elasticType: 'tx', entity: 'Transaction'}))
  return facadeTransaction(hit._source)
}

const GET_PAGINATION_FIELD = {
  ALL: 'addresses.tx_num_after_this_tx',
  SENT: 'addresses.sent_tx_num_after_this_tx',
  RECEIVED: 'addresses.received_tx_num_after_this_tx',
}

const emptyResult = {
  cursor: null,
  hasMore: false,
  totalCount: 0,
  transactions: [],
}

const PAGE_SIZE = 10

const makeAddressFilter = ({
  targetAddress,
  from,
  to,
  PAGINATION_FIELD,
}: {
  targetAddress: string,
  from?: number | null,
  to?: number | null,
  PAGINATION_FIELD?: string,
}) => {
  const pagination = [
    from != null && PAGINATION_FIELD && E.gte(PAGINATION_FIELD, from),
    to != null && PAGINATION_FIELD && E.lt(PAGINATION_FIELD, to),
  ]

  return E.nested('addresses', {
    query: E.filter([E.match('addresses.address', targetAddress), ...pagination]),
  })
}

const checkTxsCountConsistency = ({elastic}, address58, typeField, totalTxsInTxIndex) =>
  runConsistencyCheck(async () => {
    const [{cnt: totalTxsInAddressIndex}, {cnt: totalTxsInTxioIndex}] = await Promise.all([
      elastic
        .q('address')
        .filter(E.matchPhrase('_id', address58))
        .getAggregations({
          cnt: E.agg.max(`ios.${typeField}`),
        }),
      elastic
        .q('txio')
        .filter(E.matchPhrase('address', address58))
        .getAggregations({
          cnt: E.agg.max(typeField),
        }),
    ])

    validate(
      new Set([totalTxsInTxIndex, totalTxsInAddressIndex, totalTxsInTxioIndex]).size === 1,
      `Inconsistency with ${typeField}`,
      {address: address58, totalTxsInTxIndex, totalTxsInAddressIndex, totalTxsInTxioIndex}
    )
  })

export const fetchTransactionsOnAddress = async (
  {elastic, E}: any,
  address58: string,
  type: string,
  cursor: number
) => {
  const PAGINATION_FIELD = GET_PAGINATION_FIELD[type]

  const filterSent = type === 'SENT' && E.match('inputs.address', address58)
  const filterReceived = type === 'RECEIVED' && E.match('outputs.address', address58)

  // Need to get totalCount (without from & to pagination filters)
  const filterAddressWithoutPagination = makeAddressFilter({
    targetAddress: address58,
  })
  const totalCount = await elastic
    .q('tx')
    .filter(filterAddressWithoutPagination)
    .filter(filterSent)
    .filter(filterReceived)
    .getCount()

  const [typeField] = GET_PAGINATION_FIELD[type].split('.').slice(-1)
  await checkTxsCountConsistency({elastic}, address58, typeField, totalCount)

  assert(totalCount != null)

  if (totalCount === 0) {
    // we can return right away, and we also avoid unnecessary call
    return emptyResult
  }

  cursor = cursor || 0
  const cursorFrom = Math.max(totalCount - (cursor + PAGE_SIZE), 0)
  const cursorTo = Math.max(totalCount - cursor, 0)

  // Note(bigamasta): When totalCount is n, in Elastic we have tx_num_after_this_tx = 1..n
  const elasticFrom = cursorFrom + 1
  const elasticTo = cursorTo + 1

  const filterAddressWithPagination = makeAddressFilter({
    targetAddress: address58,
    from: elasticFrom,
    to: elasticTo,
    PAGINATION_FIELD,
  })

  const {hits} = await elastic
    .q('tx')
    .filter(filterAddressWithPagination)
    .filter(filterSent)
    .filter(filterReceived)
    .sortBy(
      PAGINATION_FIELD,
      'desc',
      E.nested('addresses', {filter: E.match('addresses.address', address58)})
    )
    .getHits(PAGE_SIZE)
  const transactions = hits.map((hit) => facadeTransaction(hit._source))

  const expectedNextCursor = cursor + PAGE_SIZE
  const hasMore = expectedNextCursor < totalCount
  hasMore && assert(hits.length === PAGE_SIZE)
  return {
    cursor: hasMore ? expectedNextCursor : null,
    hasMore,
    totalCount,
    transactions,
  }
}
