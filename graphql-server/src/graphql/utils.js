// @flow
import assert from 'assert'
import BigNumber from 'bignumber.js'
import moment from 'moment'

import {validate} from '../utils/validation'

type RawAdaValue = {|
  integers: number,
  decimals: number,
  full: number,
|}

// TODO: type better or use other compose function
export const compose = (...fns: any) => (x: any) => fns.reduceRight((y, f) => f(y), x)

export const parseAdaValue = (value: RawAdaValue): BigNumber => {
  validate(value.integers != null, 'parseAdaValue: Invalid raw ada value', {
    value,
  })
  validate(value.decimals != null, 'parseAdaValue: Invalid raw ada value', {
    value,
  })
  validate(value.full != null, 'parseAdaValue: Invalid raw ada value', {
    value,
  })

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

export const SLOT_COUNT = 21600
const SLOT_DURATION_SEC = 20
const EPOCH_DURATION_SEC = SLOT_COUNT * SLOT_DURATION_SEC
// Note(ppershing): not sure why it started at such weird (not modulo 20) timestamp
// Note: there is not `epoch - 1` as epochs starts from 0
// default genesis time is for Byron mainnet
const BYRON_MAINNET_START_TIME_SEC = 1506203091
const GENESIS_UNIX_TIMESTAMP_SEC = parseInt(
  process.env.GENESIS_UNIX_TIMESTAMP_SEC || BYRON_MAINNET_START_TIME_SEC
)

export const getEstimatedSlotTimestamp = (epoch: number, slot: number) => {
  assert(epoch >= 0)
  assert(slot >= 0 && slot < SLOT_COUNT)

  const startTs = GENESIS_UNIX_TIMESTAMP_SEC + slot * SLOT_DURATION_SEC + epoch * EPOCH_DURATION_SEC
  return startTs
}

const getEpochSlotFromTimestamp = (timestamp: moment) => {
  const diff = moment(timestamp).unix() - moment.unix(GENESIS_UNIX_TIMESTAMP_SEC).unix()
  assert(diff >= 0)
  const epoch = Math.floor(diff / EPOCH_DURATION_SEC)
  const slot = Math.floor((diff % EPOCH_DURATION_SEC) / SLOT_DURATION_SEC)
  return {epoch, slot}
}

// Definition of age:
// 1. E10: Pool is posted, displayed age is 0
// 2. E11: Snapshot from E10 is taken, displayed age is 0
// 3. E12: Pool becomes active, displayed age is 1
// Note: For now, we assume mocked createdAt is the date pool is posted
// Note 2: As per current definition of age, age in slots is probably not to be implemented
const SNAPSHOT_DURATION_IN_EPOCHS = 1

// returns age in epochCount
export const calculateAge = (createdAt: moment, currentEpoch: number) => {
  // Note: Maybe we'll have createdAtEpoch, refactor if needed with real data
  const {epoch: poolCreatedAtEpoch} = getEpochSlotFromTimestamp(createdAt)
  assert(currentEpoch >= poolCreatedAtEpoch)
  const epochsDiff = currentEpoch - poolCreatedAtEpoch
  const epochCount =
    epochsDiff >= 0 && epochsDiff <= 1 ? 0 : epochsDiff - SNAPSHOT_DURATION_IN_EPOCHS
  return epochCount
}
