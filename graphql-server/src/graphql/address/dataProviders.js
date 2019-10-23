// @flow
import assert from 'assert'
import {parseAdaValue} from '../utils'
import {validate} from '../../utils/validation'
import {isAddress} from '../../utils/cardano'

import {ApolloError} from 'apollo-server'

const fetchIoTotalValue = async ({elastic, E}, address58, type: 'input' | 'output') => {
  return await elastic
    .q('txio')
    .filter(E.onlyActiveFork())
    .filter(E.matchPhrase('address', address58))
    .filter(E.matchPhrase('type', type))
    .getAggregations({
      sum: E.agg.sumAda('value'),
    })
    .then(({sum}) => parseAdaValue(sum))
}

const fetchTxCount = async ({elastic, E, runConsistencyCheck}, address58) => {
  const txCount = await elastic
    .q('tx')
    .filter(E.onlyActiveFork())
    .filter(
      E.nested('addresses', {
        query: E.filter([E.match('addresses.address', address58)]),
      })
    )
    .getCount()

  // await runConsistencyCheck(async () => {
  //   const hits = await elastic
  //     .q('address')
  //     .pickFields('tx_num')
  //     .filter(E.matchPhrase('_id', address58))
  //     .getHits(1)
  //
  //   const cnt = hits.hits.length ? hits.hits[0]._source.tx_num : 0
  //
  //   validate(cnt === txCount, 'Address tx_num inconsistency', {
  //     address58,
  //     via_address: cnt,
  //     via_txs: txCount,
  //   })
  // })

  return txCount
}

export const fetchAddress = async (context: any, address58: string) => {
  const {elastic, E, runConsistencyCheck} = context
  assert(address58)
  if (!isAddress(address58)) {
    throw new ApolloError('Not an address', 'NOT_FOUND', {address58})
  }

  // Note: input/output seems reversed but it is correct :-)
  // Tx output with address A: A.balance += value
  // Tx input with address A: A.balance -= value
  // TODO(ppershing): move these to separate resolvers
  const [totalAdaSent, totalAdaReceived, transactionsCount] = await Promise.all([
    fetchIoTotalValue(context, address58, 'input'),
    fetchIoTotalValue(context, address58, 'output'),
    fetchTxCount(context, address58),
  ])

  const balance = totalAdaReceived.minus(totalAdaSent)

  // await runConsistencyCheck(async () => {
  //   const hits = await elastic
  //     .q('address')
  //     .pickFields('balance')
  //     .filter(E.matchPhrase('_id', address58))
  //     .getHits(1)
  //
  //   const balanceViaAddress = hits.hits.length ? parseAdaValue(hits.hits[0]._source.balance) : 0
  //
  //   validate(balance.eq(balanceViaAddress), 'Address.balance inconsistency', {
  //     address58,
  //     sent_viaTxio: totalAdaSent,
  //     received_viaTxio: totalAdaReceived,
  //     balanceViaAddress,
  //   })
  // })

  return {
    address58,
    transactionsCount,
    balance,
    totalAdaSent,
    totalAdaReceived,
  }
}
