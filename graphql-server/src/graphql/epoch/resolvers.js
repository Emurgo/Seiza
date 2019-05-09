import assert from 'assert'

import {
  fetchEpoch,
  fetchBlockCount,
  fetchTransactionCount,
  fetchTotalAdaSupply,
  fetchTotalFees,
} from './dataProviders'
import {fetchCurrentSyncTime} from '../status/resolvers'

const clamp = (min, max, value) => {
  if (value < min) return min
  if (value > max) return max
  return value
}

export default {
  Query: {
    epoch: (root, args, context) => fetchEpoch(null, args.epochNumber),
  },
  Epoch: {
    progress: async (epoch, args, context) => {
      const {startTime, endTime} = epoch
      const currentTime = await fetchCurrentSyncTime(context)

      const startTs = startTime.unix()
      const endTs = endTime.unix()
      const currentTs = currentTime.unix()

      assert(endTs > startTs)

      return clamp(0, 1, (currentTs - startTs) / (endTs - startTs))
    },
  },
  EpochSummary: {
    blocksCreated: async (summary, args, context) => {
      const epochNumber = summary._epochNumber
      return await fetchBlockCount(context, epochNumber)
    },

    transactionCount: async (summary, args, context) => {
      const epochNumber = summary._epochNumber
      return await fetchTransactionCount(context, epochNumber)
    },
    totalAdaSupply: async (summary, args, context) => {
      const epochNumber = summary._epochNumber
      return await fetchTotalAdaSupply(context, epochNumber)
    },
    epochFees: async (summary, args, context) => {
      const epochNumber = summary._epochNumber
      return await fetchTotalFees(context, epochNumber)
    },
  },
}
