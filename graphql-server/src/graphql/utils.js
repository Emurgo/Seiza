// @flow
import assert from 'assert'
import BigNumber from 'bignumber.js'

import {validate} from '../utils/validation'

type RawAdaValue = {|
  integers: number,
  decimals: number,
  full: number,
|}

// TODO: type better or use other compose function
export const compose = (...fns: any) => (x: any) => fns.reduceRight((y, f) => f(y), x)

export const parseAdaValue = (value: RawAdaValue): BigNumber => {
  validate(value.integers != null, 'parseAdaValue: Invalid raw ada value', {value})
  validate(value.decimals != null, 'parseAdaValue: Invalid raw ada value', {value})
  validate(value.full != null, 'parseAdaValue: Invalid raw ada value', {value})

  const res = new BigNumber(value.integers).times(1000000).plus(value.decimals)
  const resApprox = new BigNumber(value.full)
  if (res.abs().lt(9e15)) {
    // below this the values should be same
    validate(res.eq(resApprox), 'parseAdaValue: ADA value should be exact at this magnitude', value)
  } else {
    // the diff should be relatively small
    validate(
      resApprox
        .minus(res)
        .div(res)
        .lt(1.0e-15), // about ~50 bits of precision
      'parseAdaValue: Inexact raw ada value is too imprecise. Perhaps a bug?',
      {value}
    )
  }
  return res
}

export const slotCount = 21600
const slotDurationSec = 20

export const getEstimatedSlotTimestamp = (epoch: number, slot: number) => {
  assert(epoch >= 0)
  assert(slot >= 0 && slot < slotCount)

  // Note(ppershing): not sure why it started at such weird (not modulo 20) timestamp
  // Note: there is not `epoch - 1` as epochs starts from 0
  const startTs = 1506203091 + slot * slotDurationSec + epoch * slotCount * slotDurationSec
  return startTs
}
