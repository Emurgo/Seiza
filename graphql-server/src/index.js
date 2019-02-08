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

const server = new ApolloServer({
  typeDefs: mergeTypes([globalTypes, addressTypes, transactionTypes, blockTypes, statusTypes], {all: true}),
  resolvers,
  context: () => ({
    cardanoAPI,
  }),
})

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url}`) // eslint-disable-line
})
