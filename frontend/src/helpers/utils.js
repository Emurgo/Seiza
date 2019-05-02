// @flow

export const toIntOrNull = (v: string) => {
  const ret = parseInt(v, 10)
  return isNaN(ret) ? null : ret
}
