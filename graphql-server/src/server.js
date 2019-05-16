// @flow
import 'babel-polyfill'
import './loadEnv'

import CostAnalysis from './costAnalysis'
import {ApolloServer} from 'apollo-server'
import {GraphQLError} from 'graphql'
import uuidv1 from 'uuid/v1'

import {getActiveCampaign} from './api/activeCampaign'
import schema from './graphql/schema'
import resolvers from './graphql/resolvers'
import {initErrorReporting, reportError} from './utils/errorReporting'
import {isProduction} from './config'

import {pricingAPI, getElastic} from './api'

isProduction && initErrorReporting()

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

const getLogger = (uuid) => {
  const logToJSON = (v) => console.log(JSON.stringify(v, null, 2)) // eslint-disable-line
  return {
    log: (value, options = {}) => {
      const toLog = {
        logType: options.type || 'default',
        uuid,
        value,
      }
      logToJSON(toLog)
    },
  }
}

const createServer = () =>
  new ApolloServer({
    typeDefs: schema,
    resolvers,
    engine: {
      apiKey: process.env.APOLLO_ENGINE_API_KEY,
    },
    // TODO: replace with production-ready logger
    formatError: (error: GraphQLError): any => {
      // TODO: how can we get Context here, so that we can connect error to request uuid?
      logError(error)
      isProduction && reportError(error)
      stripSensitiveInfoFromError(error)
      return error
    },
    formatResponse: (response: any): any => {
      console.log(response) // eslint-disable-line
      return response
    },
    context: ({req}) => {
      const reqId = (req && req.headers['x-request-id']) || uuidv1()
      const logger = getLogger(reqId)
      const elastic = getElastic(logger)
      const activeCampaign = getActiveCampaign(logger)
      return {
        activeCampaign,
        pricingAPI,
        elastic,
        E: elastic.E,
        reqId,
      }
    },
  })

export default createServer
