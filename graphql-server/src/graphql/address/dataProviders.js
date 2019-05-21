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

  // Note: input/output seems reversed but it is correct :-)
  // Tx output with address A: A.balance += value
  // Tx input with address A: A.balance -= value
  const totalAdaSent = ioTotalValue(address58, 'input')
  const totalAdaReceived = ioTotalValue(address58, 'output')

  const balance = parseAdaValue(hit._source.balance)

  await runConsistencyCheck(async () => {
    const [s, r] = await Promise.all([totalAdaSent, totalAdaReceived])

    validate(r.minus(s).eq(balance), 'Address.balance inconsistency', {
      address58,
      sent_viaTxio: s,
      received_viaTxio: r,
      balance_viaAddress: balance,
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
