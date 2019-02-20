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
  blockTimeIssued: number,
  blockHeight: number,
  blockEpoch: number,
  blockSlot: number,
  blockHash: string,
  totalInput: string,
  totalOutput: string,
  fees: string,
  inputs: Array<{|address58: string, amount: string|}>,
  outputs: Array<{|address58: string, amount: string|}>,
}
export const facadeTransaction = (txData: TxAPIType): FacadeTransaction => ({
  txHash: txData.ctsId,
  txTimeIssued: moment.unix(txData.ctsTxTimeIssued),
  blockTimeIssued: moment.unix(txData.ctsBlockTimeIssued),
  blockHeight: txData.ctsBlockHeight,
  blockEpoch: txData.ctsBlockEpoch,
  blockSlot: txData.ctsBlockSlot,
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
})
