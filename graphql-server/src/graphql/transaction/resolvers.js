import assert from 'assert'
import {fetchBlockBySlot, fetchLatestBlock} from '../block/dataProviders'
import {fetchTransaction} from './dataProviders'

const fetchConfirmationsCount = async (context, epochSlot) => {
  const [b1, b2] = await Promise.all([
    fetchBlockBySlot(context, epochSlot),
    fetchLatestBlock(context),
  ])
  assert(b1.height != null)
  assert(b2.height != null)
  assert(b1.height <= b2.height)
  return b2.height - b1.height
}

export default {
  Query: {
    transaction: (root, args, context) => fetchTransaction(context, args.txHash),
  },

  Transaction: {
    block: (tx, args, context) => fetchBlockBySlot(context, tx._epoch_slot),
    confirmationsCount: (tx, args, context) => fetchConfirmationsCount(context, tx._epoch_slot),
  },
}
