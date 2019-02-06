export const transactionResolver = (parent, args, context) =>
  context.cardanoAPI.get(`txs/summary/${args.id}`).then(({data}) => {
    const d = data.Right
    return {
      id: d.ctsId,
      txTimeIssued: d.ctsTxTimeIssued,
      blockTimeIssued: d.ctsBlockTimeIssued,
      blockHeight: d.ctsBlockHeight,
      blockEpoch: d.ctsBlockEpoch,
      blockSlot: d.ctsBlockSlot,
      blockHash: d.ctsBlockHash,
      totalInput: d.ctsTotalInput.getCoin,
      totalOutput: d.ctsTotalOutput.getCoin,
      fees: d.ctsFees.getCoin,
      inputs: d.ctsInputs.map((input) => ({
        from: input[0],
        amount: input[1].getCoin,
      })),
      outputs: d.ctsInputs.map((output) => ({
        to: output[0],
        amount: output[1].getCoin,
      })),
    }
  })
