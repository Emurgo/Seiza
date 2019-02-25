// @flow
import moment from 'moment'
type GetCoin = {
  getCoin: string,
}
type TxAPIType = {
  ctsId: string,
  ctsTxTimeIssued: number,
  ctsBlockTimeIssued: number,
  ctsBlockHeight: number,
  ctsBlockEpoch: number,
  ctsBlockSlot: number,
  ctsBlockHash: string,
  ctsRelayedBy: null,
  ctsTotalInput: GetCoin,
  ctsTotalOutput: GetCoin,
  ctsFees: GetCoin,
  ctsInputs: Array<[string, GetCoin]>,
  ctsOutputs: Array<[string, GetCoin]>,
}
export type FacadeTransaction = {
  txHash: string,
  txTimeIssued: number,
  _blockHash: string,
  totalInput: string,
  totalOutput: string,
  fees: string,
  inputs: Array<{|address58: string, amount: string|}>,
  outputs: Array<{|address58: string, amount: string|}>,
}
export const facadeTransaction = (txData: TxAPIType): FacadeTransaction => ({
  txHash: txData.ctsId,
  txTimeIssued: moment.unix(txData.ctsTxTimeIssued),
  _blockHash: txData.ctsBlockHash,
  blockHash: txData.ctsBlockHash,
  totalInput: txData.ctsTotalInput.getCoin,
  totalOutput: txData.ctsTotalOutput.getCoin,
  fees: txData.ctsFees.getCoin,
  inputs: txData.ctsInputs.map((input) => ({
    address58: input[0],
    amount: input[1].getCoin,
  })),
  outputs: txData.ctsOutputs.map((output) => ({
    address58: output[0],
    amount: output[1].getCoin,
  })),
  size: -1, // No data right now
})

export const fetchTransaction = async (api: any, txHash: string) => {
  const rawTx = await api.get(`txs/summary/${txHash}`)
  return facadeTransaction(rawTx)
}
