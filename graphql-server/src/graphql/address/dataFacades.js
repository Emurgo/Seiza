// @flow
import BigNumber from 'bignumber.js'
import _ from 'lodash'

type GetCoin = {
  getCoin: string,
}
type Tx = {
  ctbId: string,
  ctbTimeIssued: number,
  ctbInputs: Array<[string, GetCoin]>,
  ctbOutputs: Array<[string, GetCoin]>,
  ctbInputSum: GetCoin,
  ctbOutputSum: GetCoin,
}
export type AddressAPIType = {
  caAddress: string,
  caType: string,
  caTxNum: number,
  caBalance: GetCoin,
  caTxList: Array<Tx>,
}
export type PartialFacadeAddress = {
  address58: string,
  type: string,
  transactionsCount: number,
  balance: string,
}

const sumAmounts = (rawAmounts) =>
  rawAmounts.reduce((x, y) => x.plus(new BigNumber(y, 10)), new BigNumber(0))

const getTotalAdaSent = (addr, txList) => {
  const rawAmounts = _(txList)
    .map((tx) => tx.ctbInputs)
    .flatten()
    .filter(([_addr, coin]) => addr === _addr)
    .map(([addr, coin]) => coin.getCoin)
    .value()

  return sumAmounts(rawAmounts)
}

const getTotalAdaReceived = (addr, txList) => {
  const rawAmounts = _(txList)
    .map((tx) => tx.ctbOutputs)
    .flatten()
    .filter(([_addr, coin]) => addr === _addr)
    .map(([addr, coin]) => coin.getCoin)
    .value()

  return sumAmounts(rawAmounts)
}

export const facadeAddress = (data: AddressAPIType): PartialFacadeAddress => ({
  address58: data.caAddress,
  type: data.caType,
  transactionsCount: data.caTxNum,
  balance: data.caBalance.getCoin,
  totalAdaReceived: getTotalAdaReceived(data.caAddress, data.caTxList),
  totalAdaSent: getTotalAdaSent(data.caAddress, data.caTxList),
})
