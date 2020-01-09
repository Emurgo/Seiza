// @flow
import 'babel-polyfill'
import './loadEnv'

import {ApolloServer} from 'apollo-server'
import {GraphQLError} from 'graphql'
import {FormatErrorWithContextExtension} from 'graphql-format-error-context-extension'
import uuidv1 from 'uuid/v1'
import _ from 'lodash'
import responseCachePlugin from 'apollo-server-plugin-response-cache'

// TODO: how to distinguish between _logger and logger with request id closured in it?
import _logger from './logger'
import CostAnalysis from './costAnalysis'
import {getActiveCampaign} from './api/activeCampaign'
import schema from './graphql/schema'
import resolvers from './graphql/resolvers'
import {initErrorReporting, reportError, getInfoFromError} from './utils/errorReporting'
import {getRunConsistencyCheck} from './utils/validation'

import {pricingAPI, getElastic} from './api'

initErrorReporting()

export type Parent = any

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

const _getErrorInfo = (error, reqId, reqBody, reqHeaders) => ({
  logType: 'error',
  reqId,
  reqBody,
  reqHeaders,
  ...getInfoFromError(error),
})

const getLogger = ({reqId, reqBody, reqHeaders}) => ({
  log: (value, options = {}) => {
    const info = {
      logType: options.type || 'default',
      reqId,
      value,
    }
    _logger.log({level: options.level || 'info', info})
  },
  error: (error) => {
    const info = _getErrorInfo(error, reqId, reqBody, reqHeaders)
    _logger.log({level: 'error', info})
  },
})

const getReporter = ({reqId, reqBody, reqHeaders}) => ({
  error: (error) => {
    const info = _.omit(_getErrorInfo(error, reqId, reqBody, reqHeaders), 'logType')
    reportError(error, info)
  },
})

const handleError = (error, {logger, reporter}) => {
  logger.error(error)
  reporter.error(error)
  return error
}

const maybeGetUserIpAddress = (request) => {
  const headers = request.headers
  if (!headers) return null
  // Note: 'x-forwared-for' will not be there in headers if accessed as localhost
  // Refer: https://www.prisma.io/forum/t/how-do-i-get-the-ip-address-from-the-client/4429/5
  const ipAddress = headers['x-forwarded-for']
  if (!ipAddress) return null
  return ipAddress
}

const createServer = () =>
  new ApolloServer({
    cacheControl: {
      defaultMaxAge: 20,
    },
    plugins: [responseCachePlugin()],
    typeDefs: schema,
    resolvers,
    engine: {
      apiKey: process.env.APOLLO_ENGINE_API_KEY,
    },
    extensions: [() => new FormatErrorWithContextExtension(handleError)],
    formatError: (error: GraphQLError): any => {
      // Note: Can not be applied only to `formatError` inside context extension
      stripSensitiveInfoFromError(error)
      return error
    },
    context: ({req}) => {
      // Note: `req` seems not to be defined in integration test
      const reqId = (req && req.headers['x-request-id']) || uuidv1()

      const userIp = maybeGetUserIpAddress(req)

      // Note: `req.body` could be batched, but even batched
      // query should be good enough to debug in case of error
      const logger = getLogger({reqId, reqBody: req && req.body, reqHeaders: req && req.headers})
      const reporter = getReporter({
        reqId,
        reqBody: req && req.body,
        reqHeaders: req && req.headers,
      })

      // So that we have `reqId` available also in failed run away promises
      const runConsistencyCheck = getRunConsistencyCheck((error) =>
        handleError(error, {logger, reporter})
      )

      const elastic = getElastic(logger)
      const activeCampaign = getActiveCampaign(logger)
      return {
        activeCampaign,
        pricingAPI,
        elastic,
        E: elastic.E,
        reqId,
        logger,
        reporter,
        runConsistencyCheck,
        userIp,
      }
    },
  })

export default createServer
