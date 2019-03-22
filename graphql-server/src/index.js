// @flow
import 'babel-polyfill'
import {ApolloServer, gql} from 'apollo-server'
import {mergeTypes} from 'merge-graphql-schemas'

import {fetchAddress} from './graphql/address/dataProviders'
import {fetchBlockSummary, fetchBlockTransactionIds} from './graphql/block/dataProviders'
import {fetchTransaction} from './graphql/transaction/dataProviders'
import {
  fetchBootstrapEraPool,
  fetchBootstrapEraPoolSummary,
} from './graphql/stakepool/dataProviders'

import {pagedBlocksResolver, pagedBlocksInEpochResolver} from './graphql/block/resolvers'
import {currentStatusResolver} from './graphql/status/resolvers'
import {blockChainSearchResolver} from './graphql/search/resolvers'

import stakePoolResolvers from './graphql/stakepool/resolvers'
import marketDataResolvers from './graphql/market/resolvers'
import generalInfoResolvers from './graphql/general/resolvers'
import epochResolvers from './graphql/epoch/resolvers'

import transactionSchema from './graphql/transaction/types'
import addressSchema from './graphql/address/schema.gql'
import blockSchema from './graphql/block/schema.gql'
import statusSchema from './graphql/status/schema.gql'
import searchSchema from './graphql/search/schema.gql'
import stakePoolSchema from './graphql/stakepool/schema.gql'
import marketSchema from './graphql/market/schema.gql'
import generalInfoSchema from './graphql/general/schema.gql'
import epochSchema from './graphql/epoch/schema.gql'

import Timestamp from './graphql/scalars/timestamp'
import AdaAmount from './graphql/scalars/adaAmount'

import {cardanoAPI, pricingAPI, elastic} from './api'
import type {CardanoAPI} from './api'

// TODO: global error handler

const globalTypes = gql`
  scalar Timestamp
  scalar AdaAmount
`

const _resolvers = {
  Timestamp,
  AdaAmount,
  Query: {
    transaction: (root, args, context) => fetchTransaction(context, args.txHash),
    address: (root, args, context) => fetchAddress(context.cardanoAPI, args.address58),

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
    block: (root, args, context) => fetchBlockSummary(context.cardanoAPI, args.blockHash),
    blockChainSearch: blockChainSearchResolver,
  },
  Block: {
    transactions: (block, args, context) =>
      fetchBlockTransactionIds(context.cardanoAPI, block.blockHash).then((ids) =>
        ids.map((id) => fetchTransaction(context, id))
      ),
    blockLeader: (block, args, context) => fetchBootstrapEraPool(null, block._blockLeader),
  },
  Transaction: {
    block: (tx, args, context) => fetchBlockSummary(context.cardanoAPI, tx._blockHash),
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

export type ApolloContext = {
  cardanoAPI: CardanoAPI,
}

// TODO:
export type Parent = any

const logError = (error: any) => {
  /* eslint-disable no-console */
  console.log('--------------------')
  console.log(error)
  console.log('--------------------')
  /* eslint-enable no-console */
}

const stripSensitiveInfoFromError = (error: any) => {
  if (error.extensions.code === 'INTERNAL_SERVER_ERROR') {
    // Remove all traces of js exception
    error.message = 'Internal server error'
    error.extensions.exception = {}
  }
  delete error.extensions.exception.stacktrace
}

const server = new ApolloServer({
  typeDefs: mergeTypes(
    [
      globalTypes,
      addressSchema,
      transactionSchema,
      blockSchema,
      statusSchema,
      searchSchema,
      stakePoolSchema,
      marketSchema,
      generalInfoSchema,
      epochSchema,
    ],
    {
      all: true,
    }
  ),
  resolvers: [
    _resolvers,
    stakePoolResolvers,
    marketDataResolvers,
    generalInfoResolvers,
    epochResolvers,
  ],
  // TODO: replace with production-ready logger
  formatError: (error: any): any => {
    logError(error)
    stripSensitiveInfoFromError(error)
    return error
  },
  formatResponse: (response: any): any => {
    console.log(response) // eslint-disable-line
    return response
  },
  context: (): ApolloContext => ({
    cardanoAPI,
    pricingAPI,
    elastic,
  }),
})

server.listen({port: process.env.PORT || 4000}).then(({url}) => {
  console.log(`🚀  Server ready at ${url}`) // eslint-disable-line
})
