// @flow
import assert from 'assert'
import {parseAdaValue, annotateNotFoundError} from '../utils'

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

const PAGE_SIZE = 10
export const fetchTransactionsOnAddress = async (
  {elastic, E}: any,
  address58: string,
  type: string,
  cursor: number
) => {
  // TODO: remove this block of code when sent/received ordinals are implemented in Elastic
  if (['SENT', 'RECEIVED'].includes(type)) {
    return {
      cursor: null,
      hasMore: false,
      totalCount: 0,
      transactions: [],
    }
  }
  const filterBySentOrReceived = [
    type === 'SENT' && E.match('outputs.address', address58),
    type === 'RECEIVED' && E.match('inputs.address', address58),
  ].filter((x) => x)

  const makeTxsFilter = ({from, to}: {from?: number | null, to?: number | null}) => {
    // Note(bigamasta): When totalCount is n, in Elastic we have tx_num_after_this_tx = 1..n
    const pagination = [
      from != null && E.gte('addresses.tx_num_after_this_tx', from + 1),
      to != null && E.lt('addresses.tx_num_after_this_tx', to + 1),
    ]

    return [
      E.nested('addresses', {
        query: E.filter([E.match('addresses.address', address58), ...pagination]),
      }),
      ...filterBySentOrReceived,
    ]
  }

  // Needed to get totalCount (without from & to pagination filters)
  // tx_num_after_this_tx = 1 is the newest tx
  const txsByAddressWithoutPagination = makeTxsFilter({})

  const totalCount = await elastic
    .q('tx')
    .filter(txsByAddressWithoutPagination)
    .getCount()

  assert(totalCount != null)

  cursor = cursor || 0

  // TODO: sent/received
  const from = cursor
  const to = cursor + PAGE_SIZE

  const txsByAddress = makeTxsFilter({from, to})

  const {hits} = await elastic
    .q('tx')
    .filter(txsByAddress)
    .sortBy(
      'addresses.tx_num_after_this_tx',
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
