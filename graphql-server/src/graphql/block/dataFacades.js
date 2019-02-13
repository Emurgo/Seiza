import moment from 'moment'

export const facadeBlock = (data) => ({
  epoch: data.cbeEpoch,
  slot: data.cbeSlot,
  blockHash: data.cbeBlkHash,
  timeIssued: moment.unix(data.cbeTimeIssued),
  transactionsCount: data.cbeTxNum,
  totalSend: data.cbeTotalSent.getCoin,
  size: data.cbeSize,
  blockLead: data.cbeBlockLead,
  totalFees: data.cbeFees.getCoin,
})
