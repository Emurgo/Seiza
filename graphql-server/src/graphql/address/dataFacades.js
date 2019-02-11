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
export type PartialFacadeAddress = {
  id: string,
  type: string,
  transactionsCount: number,
  balance: string,
}

export const facadeAddress = (data: AddressAPIType): PartialFacadeAddress => ({
  id: data.caAddress,
  type: data.caType,
  transactionsCount: data.caTxNum,
  balance: data.caBalance.getCoin,
})
