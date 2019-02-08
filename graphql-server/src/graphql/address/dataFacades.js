// @flow
export const facadeAddress = (data) => ({
  id: data.caAddress,
  type: data.caType,
  transactionsCount: data.caTxNum,
  balance: data.caBalance.getCoin,
})
