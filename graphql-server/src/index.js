import {ApolloServer, gql} from 'apollo-server'
import {mergeTypes} from 'merge-graphql-schemas'

import {addressResolver} from './graphql/address/resolvers'
import {transactionResolver} from './graphql/transaction/resolvers'

import transactionTypes from './graphql/transaction/types'
import addressTypes from './graphql/address/types'
import Moment from './graphql/scalars/moment'

import {cardanoAPI} from './api'

// TODO: global error handler

const globalTypes = gql`
  scalar Moment
`

const resolvers = {
  Moment,
  Query: {
    transaction: (...args) => transactionResolver(...args),
    address: (...args) => addressResolver(...args),
  },
}

const server = new ApolloServer({
  typeDefs: mergeTypes([globalTypes, addressTypes, transactionTypes], {all: true}),
  resolvers,
  context: () => ({
    cardanoAPI,
  }),
})

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url}`) // eslint-disable-line
})
