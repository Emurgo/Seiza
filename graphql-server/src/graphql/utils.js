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

// For now, it runs "synchrously" the check
// Alternative implementations for production:
// 1) skip the check at all (if load is big)
// 2) do the check in runaway promise (if we can affort the load but not the latency) and report
// errors to sentry
export const runConsistencyCheck = async (callback: Function) => {
  return await callback()
}

// TODO: type better or use other compose function
export const compose = (...fns: any) => (x: any) => fns.reduceRight((y, f) => f(y), x)

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
