import {
  fetchEpoch,
  fetchBlockCount,
  fetchTransactionCount,
  fetchTotalAdaSupply,
  fetchTotalFees,
} from './dataProviders'

export default {
  Query: {
    epoch: (root, args, context) => fetchEpoch(null, args.epochNumber),
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
