import {ApolloServer, gql} from 'apollo-server'
import {mergeTypes} from 'merge-graphql-schemas'

import {addressResolver} from './graphql/address/resolvers'
import {transactionResolver} from './graphql/transaction/resolvers'
import {blocksResolver} from './graphql/block/resolvers'

import transactionTypes from './graphql/transaction/types'
import addressTypes from './graphql/address/types'
import blockTypes from './graphql/block/types'

import Timestamp from './graphql/scalars/timestamp'

import {cardanoAPI} from './api'

// TODO: global error handler

const globalTypes = gql`
  scalar Timestamp
`

const resolvers = {
  Timestamp,
  Query: {
    transaction: (...args) => transactionResolver(...args),
    address: (...args) => addressResolver(...args),
    blocks: (...args) => blocksResolver(...args),
  },
}

const server = new ApolloServer({
  typeDefs: mergeTypes([globalTypes, addressTypes, transactionTypes, blockTypes], {all: true}),
  resolvers,
  context: () => ({
    cardanoAPI,
  }),
})

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url}`) // eslint-disable-line
})
