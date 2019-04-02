// @flow
import assert from 'assert'
import {ApolloError} from 'apollo-server'

export const facadeElasticTransaction = (source: any) => {
  return {
    txHash: source.hash,
    _epoch_slot: {epoch: source.epoch, slot: source.slot},
    totalInput: source.sum_inputs,
    totalOutput: source.sum_outputs,
    // TODO: what about refunds?
    fees: source.fees,

    // TODO: this is a hack for now
    inputs: source.txio
      .map((io) => ({address58: io.address[0], amount: io.val}))
      .filter(({amount}) => amount < 0)
      .map(({address58, amount}) => ({address58, amount: -amount})),
    outputs: source.txio
      .map((io) => ({address58: io.address[0], amount: io.val}))
      .filter(({amount}) => amount >= 0),

    // TODO: tx size is missing in data
    size: null,
    supplyAfter: source.supply,
  }
}

export const fetchTransaction = async ({elastic}: any, txHash: string) => {
  const {hits} = await elastic.search({
    index: 'seiza.tx',
    type: 'tx',
    body: {
      query: elastic._matchPhrase('hash', txHash),
    },
  })

  // TODO: generate only warning for total>0?
  assert(hits.total <= 1)

  // TODO: better error handling of total==0
  if (hits.total !== 1) {
    throw new ApolloError('Transaction not found', 'NOT_FOUND', {txHash})
  }
  return facadeElasticTransaction(hits.hits[0]._source)
}
