import moment from 'moment'

export const facadeBlock = (data) => ({
  blockHash: data.cbeBlkHash,
  epoch: data.cbeEpoch,
  slot: data.cbeSlot,
  timeIssued: moment.unix(data.cbeTimeIssued),
  transactionsCount: data.cbeTxNum,
  totalSend: data.cbeTotalSent.getCoin,
  size: data.cbeSize,
  blockLead: data.cbeBlockLead,
  totalFees: data.cbeFees.getCoin,
})

export const fetchBlockSummary = async (api, blockHash) => {
  const rawResponse = await api.get(`blocks/summary/${blockHash}`)
  return facadeBlock(rawResponse.cbsEntry)
}

export const fetchBlockTransactionIds = async (api, blockHash) => {
  const rawResult = await api.get(`blocks/txs/${blockHash}`)
  return rawResult.map((tx) => tx.ctbId)
}

export const PAGE_SIZE = 10

export const _fetchPage = async (pageId, context) => {
  const queryParams = {
    pageSize: PAGE_SIZE,
    page: pageId,
  }

  const [lastPageId, blocks] = await context.cardanoAPI.get('blocks/pages', queryParams)

  return {
    pageId: pageId != null ? pageId : lastPageId,
    blocks: blocks.map(facadeBlock),
  }
}
