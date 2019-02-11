// @flow
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

export const facadeAddress = (data: AddressAPIType) => ({
  id: data.caAddress,
  type: data.caType,
  transactionsCount: data.caTxNum,
  balance: data.caBalance.getCoin,
})
