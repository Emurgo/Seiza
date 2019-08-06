const client = require('./client')
const actions = require('./actions')

const fetch_pagedBlocks = (cursor) =>
  client
    .request(
      `query pagedBlocks($cursor: Int) {
    pagedBlocks(cursor: $cursor) {
      hasMore
      cursor
      totalCount
      blocks {
        blockHash
      }
    }
  }`,
      {cursor}
    )
    .then((data) => data.pagedBlocks)

const fetch_block = (hash) =>
  client
    .request(
      `query block($hash: String!) {
    block(blockHash: $hash) {
      blockHash
      epoch
      slot
      timeIssued
      transactionsCount
      totalSent
      totalFees
      blockHeight
      previousBlock {blockHash}
      nextBlock {blockHash}
      blockLeader {poolHash}
      transactions {
        txHash
      }
    }
  }`,
      {hash}
    )
    .then((data) => data.block)

let progress = -1

const updateProgress = (h) => {
  progress = h
}
const getProgress = () => progress

const crawl_block = (schedule_crawl) => async ({blockHash}) => {
  const data = await fetch_block(blockHash)
  updateProgress(data.blockHeight)
  data.transactions.forEach(({txHash}) => schedule_crawl(actions.transaction(txHash)))
}

const crawl_pagedBlocks = (schedule_crawl) => async ({cursor}) => {
  const data = await fetch_pagedBlocks(cursor)

  data.blocks.forEach(({blockHash}) => schedule_crawl(actions.block(blockHash)))
  data.hasMore && schedule_crawl(actions.pagedBlocks(data.cursor))
}

module.exports = {
  crawl_block,
  crawl_pagedBlocks,
  getProgress,
}
