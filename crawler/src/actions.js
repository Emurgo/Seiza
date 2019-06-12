const address = (addr58) => ({
  type: 'address',
  payload: {
    addr58,
  },
})
address.type = 'address'

const address_txs = (addr58, filter, cursor) => ({
  type: 'address_txs',
  payload: {
    addr58,
    filter,
    cursor,
  },
})
address_txs.type = 'address_txs'

const transaction = (txHash) => ({
  type: 'tx',
  payload: {
    txHash,
  },
})
transaction.type = 'tx'

const pagedBlocks = (cursor) => ({
  type: 'paged_blocks',
  payload: {
    cursor,
  },
})
pagedBlocks.type = 'paged_blocks'

const block = (blockHash) => ({
  type: 'block',
  payload: {
    blockHash,
  },
})
block.type = 'block'

module.exports = {
  address,
  address_txs,
  transaction,
  pagedBlocks,
  block,
}
