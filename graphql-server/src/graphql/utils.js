// @flow
import assert from 'assert'
import BigNumber from 'bignumber.js'

type RawAdaValue = {|
  integers: number,
  decimals: number,
  full: number,
|}

export const parseAdaValue = (value: RawAdaValue): BigNumber => {
  assert(value.integers != null, 'Invalid raw ada value')
  assert(value.decimals != null, 'Invalid raw ada value')
  assert(value.full != null, 'Invalid raw ada value')

  const res = new BigNumber(value.integers).times(1000000).plus(value.decimals)
  const resApprox = new BigNumber(value.full)
  if (res.abs().lt(1.8e16)) {
    // below this the values should be same
    assert(res.eq(resApprox), 'ADA value should be consistent at this magnitude')
  } else {
    // the diff should be relatively small
    assert(
      resApprox
        .minus(res)
        .div(res)
        .lt(1.0e-16),
      'Inexact raw ada value is too imprecise. Perhaps a bug?'
    )
  }
  return res
}
