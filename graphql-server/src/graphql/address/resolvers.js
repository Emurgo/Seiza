export const addressResolver = (parent, args, context) =>
  context.cardanoAPI.get(`addresses/summary/${args.id}`).then(({data}) => {
    const d = data.Right
    return {
      id: d.caAddress,
      type: d.caType,
      txNum: d.caTxNum,
      balance: d.caBalance.getCoin,
      transactions: d.caTxList.map((transaction) => ({
        id: transaction.ctbId,
        timeIssued: transaction.ctbTimeIssued,
        inputs: transaction.ctbInputs.map((input) => ({
          from: input[0],
          amount: input[1].getCoin,
        })),
        outputs: transaction.ctbInputs.map((output) => ({
          to: output[0],
          amount: output[1].getCoin,
        })),
      })),
    }
  })
