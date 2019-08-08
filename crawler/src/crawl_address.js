const client = require('./client')
const actions = require('./actions')

const fetch_address = (addr58) =>
  client
    .request(
      `query address($addr58: String!) {
    address(address58: $addr58) {
      balance
      totalAdaSent
      totalAdaReceived
      transactionsCount
    }
  }`,
      {addr58}
    )
    .then((data) => data.address)

const fetch_address_transactions = (addr58, filter, cursor) =>
  client
    .request(
      `query address($addr58: String!, $filter:AddressTxsFilter!, $cursor: Int) {
    address(address58: $addr58) {
      transactions(type: $filter, cursor: $cursor) {
        cursor
        hasMore
        totalCount
        transactions {
          txHash
        }
      }
    }
  }`,
      {addr58, filter, cursor}
    )
    .then((data) => data.address.transactions)

const crawl_address = (schedule_crawl) => async ({addr58}) => {
  // eslint-disable-next-line no-unused-vars
  const data = await fetch_address(addr58)
  schedule_crawl(actions.address_txs(addr58, 'ALL', null))
  schedule_crawl(actions.address_txs(addr58, 'SENT', null))
  schedule_crawl(actions.address_txs(addr58, 'RECEIVED', null))
}

const crawl_address_transactions = (schedule_crawl) => async ({addr58, filter, cursor}) => {
  const data = await fetch_address_transactions(addr58, filter, cursor)
  if (data.hasMore) schedule_crawl(actions.address_txs(addr58, filter, data.cursor))
}

module.exports = {crawl_address, crawl_address_transactions}
