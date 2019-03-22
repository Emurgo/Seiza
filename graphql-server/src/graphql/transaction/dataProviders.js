// @flow
import _ from 'lodash'
import assert from 'assert'
import {ApolloError} from 'apollo-server'
import Bignumber from 'bignumber.js'

const facadeElasticTransaction = (source: any) => {
  // TODO: bignumber sum
  const _sum = (amounts) => amounts.reduce((acc, x) => acc.plus(new Bignumber(x, 10)), Bignumber(0))

  const totalInput = _sum(source.inputs_amount)
  const totalOutput = _sum(source.outputs_amount)

  return {
    txHash: source.hash,
    _blockHash: source.block_hash,
    blockHash: source.block_hash,

    totalInput,
    totalOutput,
    // TODO: what about refunds?
    fees: totalInput.minus(totalOutput),

    inputs: _.zip(source.inputs_address, source.inputs_amount).map(([address58, amount]) => ({
      address58,
      amount,
    })),
    outputs: _.zip(source.outputs_address, source.outputs_amount).map(([address58, amount]) => ({
      address58,
      amount,
    })),

    // Note: tx_body is hex-encoded
    size: source.tx_body.length / 2,
  }
}

export const fetchTransaction = async ({elastic}: any, txHash: string) => {
  const {hits} = await elastic.search({
    index: 'txs',
    type: 'txs',
    body: {
      query: {
        match_phrase: {
          hash: txHash,
        },
      },
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
