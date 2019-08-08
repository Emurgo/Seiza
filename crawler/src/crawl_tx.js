const client = require('./client')
const actions = require('./actions')

const fetch_tx = (hash) =>
  client
    .request(
      `query transaction($hash: String!) {
    transaction(txHash: $hash) {
      txHash
      block {
        blockHash
      }
      totalInput
      totalOutput
      fees
      inputs {
        address58
      }
      outputs {
        address58
      }
    }
  }`,
      {hash}
    )
    .then((data) => data.transaction)

const crawl_tx = (schedule_crawl) => async ({txHash}) => {
  const data = await fetch_tx(txHash)
  data.inputs.forEach(({address58}) => schedule_crawl(actions.address(address58)))
  data.outputs.forEach(({address58}) => schedule_crawl(actions.address(address58)))
}

module.exports = {
  crawl_tx,
}
