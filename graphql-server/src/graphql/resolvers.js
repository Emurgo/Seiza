import {pagedBlocksResolver, pagedBlocksInEpochResolver} from './block/resolvers'
import {currentStatusResolver} from './status/resolvers'
import {blockChainSearchResolver} from './search/resolvers'

import stakePoolResolvers from './stakepool/resolvers'
import marketDataResolvers from './market/resolvers'
import generalInfoResolvers from './general/resolvers'
import epochResolvers from './epoch/resolvers'
import stakepoolsResolvers from './stakingInfo/resolvers'
import transactionResolvers from './transaction/resolvers'

import {fetchAddress} from './address/dataProviders'
import {fetchBlockByHash, fetchPreviousBlock, fetchNextBlock} from './block/dataProviders'
import {fetchTransaction} from './transaction/dataProviders'
import {fetchBootstrapEraPool, fetchBootstrapEraPoolSummary} from './stakepool/dataProviders'

import Timestamp from './scalars/timestamp'
import AdaAmount from './scalars/adaAmount'

const _resolvers = {
  Timestamp,
  AdaAmount,
  URL,
  Query: {
    transaction: (root, args, context) => fetchTransaction(context, args.txHash),
    address: (root, args, context) => fetchAddress(context, args.address58),

    currentStatus: currentStatusResolver,
    pagedBlocks: async (_, args, context) => {
      const result = await pagedBlocksResolver(_, args, context)
      return {
        blocks: result.data,
        cursor: result.cursor,
        hasMore: result.cursor > 0,
      }
    },
    pagedBlocksInEpoch: async (_, args, context) => {
      const result = await pagedBlocksInEpochResolver(_, args, context)
      return {
        blocks: result.data,
        cursor: result.cursor,
        hasMore: result.cursor > 0,
      }
    },
    block: (root, args, context) => fetchBlockByHash(context, args.blockHash),
    blockChainSearch: blockChainSearchResolver,
  },
  Block: {
    transactions: (block, args, context) => block._txs.map((id) => fetchTransaction(context, id)),
    blockLeader: (block, args, context) => fetchBootstrapEraPool(null, block._blockLeader),
    previousBlock: (block, args, context) =>
      fetchPreviousBlock(context, {slot: block.slot, epoch: block.epoch}),
    nextBlock: (block, args, context) =>
      fetchNextBlock(context, {slot: block.slot, epoch: block.epoch}),
  },
  Address: {
    transactions: (address, args, context) =>
      Promise.all(address._transactionIds.map((id) => fetchTransaction(context, id))),
  },
  BlockChainSearchItem: {
    __resolveType: (obj, context, info) => obj._type,
  },
  BootstrapEraStakePool: {
    summary: (pool, args, context) =>
      fetchBootstrapEraPoolSummary(null, pool.poolHash, pool._epochNumber),
  },
}

export default [
  _resolvers,
  stakePoolResolvers,
  marketDataResolvers,
  generalInfoResolvers,
  epochResolvers,
  stakepoolsResolvers,
  transactionResolvers,
]
