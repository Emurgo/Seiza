// @flow
import assert, {AssertionError} from 'assert'
import {ApolloError} from 'apollo-server'
import BigNumber from 'bignumber.js'
import {reportError} from '../utils/errorReporting'

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

export const runConsistencyCheck = async (callback: Function) => {
  if (process.env.NODE_ENV === 'development') {
    return await callback()
  } else {
    // In production fire a runaway promise
    Promise.resolve()
      .then(() => callback())
      .catch((err) => reportError(err))
    // And return early
    return Promise.resolve()
  }
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

class GenericErrorWithContext extends Error {
  constructor(message: string, ctx: any) {
    super(message)
    this.message = message
    // $FlowFixMe we are creating new property. That is fine ...
    this.ctx = ctx
  }
}

export class EntityNotFoundError extends GenericErrorWithContext {}

export const annotateNotFoundError = (annotation: any) => (err: any) => {
  if (err instanceof EntityNotFoundError) {
    throw new ApolloError('Not found', 'NOT_FOUND', annotation)
  }
  throw err
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
