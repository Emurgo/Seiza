/* eslint-disable no-console */
const ora = require('ora')
// note: const PQueue = require('p-queue') does not work for some obscure reason
const {default: PQueue} = require('p-queue')

const config = require('./config')
const actions = require('./actions')

const {crawl_block, crawl_pagedBlocks, getProgress} = require('./crawl_block')
const {crawl_tx} = require('./crawl_tx')
const {crawl_address, crawl_address_transactions} = require('./crawl_address')
const util = require('util')

const spinner = ora()

const patch_console_log = () => {
  const _log = console.log
  console.log = (...args) => {
    spinner.stop()
    _log(...args)
    spinner.start()
  }
}

const queue = new PQueue({concurrency: config.MAX_WORKERS})

const seen = new Set()

const _enqueue = (action) => {
  const key = JSON.stringify(action)

  if (seen.has(key)) return
  seen.add(key)

  queue.add(async () => {
    try {
      // eslint-disable-next-line no-use-before-define
      await run_job(action)
    } catch (e) {
      console.error('Internal error running job: ', key, e)
    }
  })
}

const DISPATCHER = {
  [actions.pagedBlocks.type]: crawl_pagedBlocks,
  [actions.block.type]: crawl_block,
  [actions.address.type]: crawl_address,
  [actions.address_txs.type]: crawl_address_transactions,
  [actions.transaction.type]: crawl_tx,
}

const delay = util.promisify(setTimeout)

const run_job = async ({type, payload}) => {
  const handler = DISPATCHER[type](_enqueue)
  const infoText = `block:~${getProgress()}, jobs_done:${seen.size -
    queue.size} |> ${type} ${JSON.stringify(payload)}`

  try {
    spinner.start(infoText)
    await handler(payload)
  } catch (error) {
    await delay(30 * 1000) // wait 30 seconds and retry
    try {
      await handler(payload)
    } catch (error) {
      spinner.fail(`${infoText} - ${error.message}`)
    }
  }
}

patch_console_log()
_enqueue(actions.pagedBlocks(config.START_BLOCK))
queue.onIdle().then(() => {
  spinner.stop()
  process.exit(0)
})
