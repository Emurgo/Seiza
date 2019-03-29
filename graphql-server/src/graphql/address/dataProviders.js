// @flow
import assert from 'assert'
import {parseAdaValue, annotateNotFoundError} from '../utils'
import BigNumber from 'bignumber.js'
import _ from 'lodash'

const adaSum = (array) => array.reduce((x, y) => x.plus(y), new BigNumber(0))

export const facadeAddress = (source: any, __id: string) => ({
  address58: __id,
  type: 'TODO: FIX IN ELASTIC',
  transactionsCount: source.tx_num,
  balance: parseAdaValue(source.balance),
  totalAdaReceived: adaSum(
    source.ios.filter((io) => io.type === 'output').map((io) => parseAdaValue(io.value))
  ),
  totalAdaSent: adaSum(
    source.ios.filter((io) => io.type === 'input').map((io) => parseAdaValue(io.value))
  ),
  _transactionIds: _(source.ios.map((io) => io.tx_hash))
    .uniq()
    .reverse() // Note: we want transactions to be sorted newest-to-oldest
    .value(),
})

export const fetchAddress = async ({elastic, E}: any, address58: string) => {
  assert(address58)

  const hit = await elastic
    .q('address')
    .filter(E.matchPhrase('_id', address58))
    .getSingleHit()
    .catch(annotateNotFoundError({entity: 'Address'}))
  return facadeAddress(hit._source, hit._id)
}
