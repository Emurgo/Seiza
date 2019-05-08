// @flow
import 'babel-polyfill'
import './loadEnv'

import CostAnalysis from './costAnalysis'
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

// Note(ppershing): We need to extend ApolloServer class
// https://github.com/pa-bru/graphql-cost-analysis/issues/12

// Unfortunately, something in the transpilation process confuses
// ES6 and ES5 classes and if we just try
// class MyApolloServer extends ApolloServer {}
// it will fail with some super() problems.
// As a result, we use a workaround with good old monkey-patching
const _old = ApolloServer.prototype.createGraphQLServerOptions

async function _new(req, res) {
  const options = await _old.bind(this)(req, res)
  options.validationRules = [
    (context) =>
      new CostAnalysis(context, {
        variables: req.body.variables,
        maximumCost: 1000,
        defaultCost: 1,
      }),
  ]
  return options
}

ApolloServer.prototype.createGraphQLServerOptions = _new
// end of workaround

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
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
