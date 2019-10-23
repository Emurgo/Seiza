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
import {
  fetchBlockByHash,
  fetchPreviousBlock,
  fetchNextBlock,
  fetchBlockBySlot,
} from './block/dataProviders'

import {fetchTransaction, fetchTransactionsOnAddress} from './transaction/dataProviders'
import {fetchBootstrapEraPool, fetchBootstrapEraPoolSummary} from './stakepool/dataProviders'
import {subscribe} from './activecampaign/dataProviders'

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
    pagedBlocks: pagedBlocksResolver,
    pagedBlocksInEpoch: pagedBlocksInEpochResolver,
    // TODO: move to Block folder
    block: (root, args, context) => fetchBlockByHash(context, args.blockHash),
    slot: (root, args, context) => fetchBlockBySlot(context, {epoch: args.epoch, slot: args.slot}),
    blockChainSearch: blockChainSearchResolver,
  },
  Block: {
    isEmpty: (block) => block.blockHash == null,
    transactions: (block, args, context) => block._txs.map((id) => fetchTransaction(context, id)),
    blockLeader: (block, args, context) => fetchBootstrapEraPool(context, block._blockLeader),
    previousBlock: (block, args, context) =>
      fetchPreviousBlock(context, {slot: block.slot, epoch: block.epoch}),
    nextBlock: (block, args, context) =>
      fetchNextBlock(context, {slot: block.slot, epoch: block.epoch}),
  },
  Address: {
    transactions: (address, args, context) =>
      fetchTransactionsOnAddress(context, address.address58, args.type, args.cursor),
  },
  BlockChainSearchItem: {
    __resolveType: (obj, context, info) => obj._type,
  },
  BootstrapEraStakePool: {
    summary: (pool, args, context) =>
      fetchBootstrapEraPoolSummary(context, pool.poolHash, pool._epochNumber),
  },
  Mutation: {
    subscribeToNewsletter: (root, args, context) => subscribe(context, args.email),
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
