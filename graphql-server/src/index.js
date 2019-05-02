// @flow
import 'babel-polyfill'
import './loadEnv'

import {ApolloServer} from 'apollo-server'

import * as ActiveCampaign from './api/activeCampaign'
import schema from './graphql/schema'
import resolvers from './graphql/resolvers'

import {pricingAPI, elastic} from './api'

export type Parent = any

const logError = (error: any) => {
  /* eslint-disable no-console */
  console.log('--------------------')
  console.dir(error, {depth: 4})
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
  typeDefs: schema,
  resolvers,
  engine: {
    apiKey: process.env.APOLLO_ENGINE_API_KEY,
  },
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
  context: () => ({
    activeCampaign: ActiveCampaign,
    pricingAPI,
    elastic,
    E: elastic.E,
  }),
})

server.listen({port: process.env.PORT || 4000}).then(({url}) => {
  console.log(`🚀  Server ready at ${url}`) // eslint-disable-line
})
