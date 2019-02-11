// @flow
import 'babel-polyfill'
import {ApolloServer, gql} from 'apollo-server'
import {mergeTypes} from 'merge-graphql-schemas'

import {addressResolver} from './graphql/address/resolvers'
import {transactionResolver} from './graphql/transaction/resolvers'
import {blocksResolver} from './graphql/block/resolvers'
import {currentStatusResolver} from './graphql/status/resolvers'

import transactionTypes from './graphql/transaction/types'
import addressTypes from './graphql/address/types'
import blockTypes from './graphql/block/types'

import Timestamp from './graphql/scalars/timestamp'
import statusTypes from './graphql/status/types'
import {cardanoAPI} from './api'
import type {CardanoAPI} from './api'

// TODO: global error handler

const globalTypes = gql`
  scalar Timestamp
`

const resolvers = {
  Timestamp,
  Query: {
    transaction: transactionResolver,
    address: addressResolver,
    currentStatus: currentStatusResolver,
    blocks: async (_, args, context) => {
      const result = await blocksResolver(_, args, context)
      return {
        blocks: result.data,
        cursor: result.fetchedPage - 1,
        hasMore: result.fetchedPage > 0,
      }
    },
  },
}

export type ApolloContext = {
  cardanoAPI: CardanoAPI,
}

// TODO:
export type Parent = any

const server = new ApolloServer({
  typeDefs: mergeTypes([globalTypes, addressTypes, transactionTypes, blockTypes, statusTypes], {
    all: true,
  }),
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
