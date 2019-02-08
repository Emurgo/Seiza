// @flow
export const facadeTransaction = (data) => ({
  id: data.ctsId,
  txTimeIssued: data.ctsTxTimeIssued,
  blockTimeIssued: data.ctsBlockTimeIssued,
  blockHeight: data.ctsBlockHeight,
  blockEpoch: data.ctsBlockEpoch,
  blockSlot: data.ctsBlockSlot,
  blockHash: data.ctsBlockHash,
  totalInput: data.ctsTotalInput.getCoin,
  totalOutput: data.ctsTotalOutput.getCoin,
  fees: data.ctsFees.getCoin,
  inputs: data.ctsInputs.map((input) => ({
    address58: input[0],
    amount: input[1].getCoin,
  })),
  outputs: data.ctsInputs.map((output) => ({
    address58: output[0],
    amount: output[1].getCoin,
  })),
})
