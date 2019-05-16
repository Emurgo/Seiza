// @flow
import assert from 'assert'
import {parseAdaValue, annotateNotFoundError, validate, runConsistencyCheck} from '../utils'

export const fetchAddress = async ({elastic, E}: any, address58: string) => {
  assert(address58)

  const hit = await elastic
    .q('address')
    .filter(E.matchPhrase('_id', address58))
    .getSingleHit()
    .catch(annotateNotFoundError({entity: 'Address'}))

  const ioTotalValue = (address58, type) =>
    elastic
      .q('txio')
      .filter(E.matchPhrase('address', address58))
      .filter(E.matchPhrase('type', type))
      .getAggregations({
        sum: E.agg.sumAda('value'),
      })
      .then(({sum}) => parseAdaValue(sum))

  const totalAdaSent = ioTotalValue(address58, 'output')
  const totalAdaReceived = ioTotalValue(address58, 'input')

  const balance = parseAdaValue(hit._source.balance)

  await runConsistencyCheck(async () => {
    const [s, r] = await Promise.all([totalAdaSent, totalAdaReceived])

    validate(s.minus(r).eq(balance), 'Inconsistency in address balance', {
      txios_sent: s,
      txios_received: r,
      address_balance: balance,
    })
  })

  return {
    address58,
    transactionsCount: hit._source.tx_num,
    balance,
    totalAdaSent,
    totalAdaReceived,
  }
}
