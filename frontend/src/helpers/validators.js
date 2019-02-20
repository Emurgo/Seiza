// @flow

// TODO: rethink output format of validators once there is more of them
// and we have real "feedback" messages shown to a user

export const isInRange = (value: string | number, from: number, to: number) => {
  const parsedValue = parseInt(value, 10)
  return Number.isInteger(parsedValue) && parsedValue >= from && parsedValue < to
}
