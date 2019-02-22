// @flow
import 'babel-polyfill'
import {ApolloServer, gql} from 'apollo-server'
import {mergeTypes} from 'merge-graphql-schemas'

import {fetchAddress} from './graphql/address/dataProviders'
import {fetchBlockSummary, fetchBlockTransactionIds} from './graphql/block/dataProviders'
import {fetchTransaction} from './graphql/transaction/dataProviders'
import {pagedBlocksResolver} from './graphql/block/resolvers'
import {currentStatusResolver} from './graphql/status/resolvers'
import {blockChainSearchResolver} from './graphql/search/resolvers'

import transactionTypes from './graphql/transaction/types'
import addressTypes from './graphql/address/schema.gql'
import blockTypes from './graphql/block/schema.gql'
import statusTypes from './graphql/status/schema.gql'
import searchTypes from './graphql/search/schema.gql'

import Timestamp from './graphql/scalars/timestamp'
import AdaAmount from './graphql/scalars/adaAmount'

import {cardanoAPI} from './api'
import type {CardanoAPI} from './api'

// TODO: global error handler

const globalTypes = gql`
  scalar Timestamp
  scalar AdaAmount
`

const resolvers = {
  Timestamp,
  AdaAmount,
  Query: {
    transaction: (root, args, context) => fetchTransaction(context.cardanoAPI, args.txHash),
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
    block: (root, args, context) => fetchBlockSummary(context.cardanoAPI, args.blockHash),
    blockChainSearch: blockChainSearchResolver,
  },
  Block: {
    transactions: (block, args, context) =>
      fetchBlockTransactionIds(context.cardanoAPI, block.blockHash).then((ids) =>
        Promise.all(ids.map((id) => fetchTransaction(context.cardanoAPI, id)))
      ),
  },
  Transaction: {
    block: (tx, args, context) => fetchBlockSummary(context.cardanoAPI, tx._blockHash),
  },
  Address: {
    transactions: (address, args, context) =>
      Promise.all(address._transactionIds.map((id) => fetchTransaction(context.cardanoAPI, id))),
  },
  BlockChainSearchItem: {
    __resolveType: (obj, context, info) => obj._type,
  },
}

export type ApolloContext = {
  cardanoAPI: CardanoAPI,
}

// TODO:
export type Parent = any

const server = new ApolloServer({
  typeDefs: mergeTypes(
    [globalTypes, addressTypes, transactionTypes, blockTypes, statusTypes, searchTypes],
    {
      all: true,
    }
  ),
  resolvers,
  // TODO: replace with production-ready logger
  formatError: (error: any): any => {
    console.log(error) // eslint-disable-line
    return error
  },
  formatResponse: (response: any): any => {
    console.log(response) // eslint-disable-line
    return response
  },
  context: (): ApolloContext => ({
    cardanoAPI,
  }),
})

server.listen({port: process.env.PORT || 4000}).then(({url}) => {
  console.log(`🚀  Server ready at ${url}`) // eslint-disable-line
})
