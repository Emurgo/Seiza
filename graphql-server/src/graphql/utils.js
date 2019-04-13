// @flow
import {AssertionError} from 'assert'
import BigNumber from 'bignumber.js'

type RawAdaValue = {|
  integers: number,
  decimals: number,
  full: number,
|}

export const validate = (cond: boolean, message: string, ctx: any) => {
  if (!cond) {
    const err = new AssertionError({message})
    // $FlowFixMe we are creating new property. That is fine ...
    err.ctx = ctx
    throw err
  }
}

export const parseAdaValue = (value: RawAdaValue): BigNumber => {
  validate(value.integers != null, 'Invalid raw ada value', {value})
  validate(value.decimals != null, 'Invalid raw ada value', {value})
  validate(value.full != null, 'Invalid raw ada value', {value})

  const res = new BigNumber(value.integers).times(1000000).plus(value.decimals)
  const resApprox = new BigNumber(value.full)
  if (res.abs().lt(9e15)) {
    // below this the values should be same
    validate(res.eq(resApprox), 'ADA value should be consistent at this magnitude', value)
  } else {
    // the diff should be relatively small
    validate(
      resApprox
        .minus(res)
        .div(res)
        .lt(1.0e-15), // about ~50 bits of precision
      'Inexact raw ada value is too imprecise. Perhaps a bug?',
      {value}
    )
  }
  return res
}
