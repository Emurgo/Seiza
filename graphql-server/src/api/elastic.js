// @flow

// Note: we are forced to use legacy client until http-aws-es is fixed
// https://github.com/TheDeveloper/http-aws-es/issues/63

//import {Client, errors as ElasticsearchErrors} from '@elastic/elasticsearch'
import {Client as LegacyClient, errors as LegacyErrors} from 'elasticsearch'

import httpAWSES from 'http-aws-es'
import AWS from 'aws-sdk'
import {ApolloError} from 'apollo-server'
import assert from 'assert'

import {EntityNotFoundError} from '../utils/errors'
import {validate} from '../utils/validation'
import _logger from '../logger'
import E, {Query} from './elasticHelpers'

import https from 'https'

const ELASTIC_URL = process.env.ELASTIC_URL
const ELASTIC_INDEX = process.env.ELASTIC_INDEX
validate(!!ELASTIC_INDEX, 'Elastic index must be set', {
  value: ELASTIC_INDEX,
})
validate(!!ELASTIC_URL, 'Elastic url must be set', {value: ELASTIC_URL})

// if AWS credentials were provided via env, we use 'aws-elasticsearch-client'
const getClient = () => {
  if (
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION
  ) {
    _logger.log({level: 'info', info: 'Using AWS auth'})
    const options = {
      host: ELASTIC_URL,
      credentials: new AWS.Credentials({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }),
    }

    const config = Object.assign({}, options, {
      connectionClass: httpAWSES,
      awsConfig: new AWS.Config({
        httpOptions: {
          // Note(ppershing): Copied from
          // eslint-disable-next-line max-len
          // https://github.com/elastic/elasticsearch-js-legacy/blob/16.x/src/lib/connectors/http.js#L42
          // however official node docs do not seem to have all the keepalive options
          // https://nodejs.org/api/http.html#http_new_agent_options
          agent: new https.Agent({
            maxSockets: Infinity,
            keepAlive: true,
            keepAliveInterval: 1000,
            keepAliveMaxFreeSockets: 256,
            keepAliveFreeSocketTimeout: 60000,
          }),
        },
        region: process.env.AWS_REGION,
        credentials: options.credentials,
      }),
    })

    const awsClient = new LegacyClient(config)
    return awsClient
  } else {
    _logger.log({level: 'info', info: 'Using normal http'})
    const plainClient = new LegacyClient({host: ELASTIC_URL})
    return plainClient
  }
}

const client = getClient()

const getElastic = (logger: Function) => {
  /* Note: non-legacy code commented out for now

  // This checks elastic response for validaty.
  // For now we prefer to be rather strict than to return partial data
  const checkResponse = (response: any, meta: any = {}) => {
    if (response.statusCode !== 200) {
      throw new ApolloError('Bad response from database', 'DB_ERROR', {
        ...meta,
        reason: 'invalid status code',
        response,
      })
    }

    if (response.warnings != null) {
      throw new ApolloError('Bad response from database', 'DB_ERROR', {
        ...meta,
        reason: 'response contains warnings',
        response,
      })
    }

    assert(response.body != null)
    assert(response.body._shards != null)

    if (response.body._shards.failed !== 0) {
      throw new ApolloError('Bad response from database', 'DB_ERROR', {
        ...meta,
        reason: 'failed shards',
        response,
      })
    }

    return response
  }


  // Converts elasticsearch Client error into ApolloError
  // Note that this is called only when request totally afails/times out
  // and we do not get *any* response.
  const elasticErrorHandler = (err, meta) => {
    assert(err instanceof ElasticsearchErrors.ElasticsearchClientError)
    // TODO: maybe distinguish between the errors from
    // https://github.com/elastic/elasticsearch-js/blob/master/lib/errors.js

    if (err instanceof ElasticsearchErrors.ResponseError) {
      throw new ApolloError('Bad response from database', 'DB_ERROR', {
        ...meta,
        reason: 'response error',
        err,
        response: err.meta.body,
      })
    }

    throw new ApolloError('Could not reach database', 'DB_UNREACHABLE', {...meta, err})
  }
  */

  const legacyCheckResponse = (response: any, meta: any = {}) => {
    assert(response._shards != null)

    if (response._shards.failed !== 0) {
      throw new ApolloError('Bad response from database', 'DB_ERROR', {
        ...meta,
        reason: 'failed shards',
        response,
      })
    }

    return response
  }

  const legacyErrorHandler = (err, meta) => {
    assert(err instanceof LegacyErrors._Abstract)

    if (
      err instanceof LegacyErrors.ConnectionFault ||
      err instanceof LegacyErrors.RequestTimeout ||
      err instanceof LegacyErrors.NoConnections
    ) {
      throw new ApolloError('Could not reach database', 'DB_UNREACHABLE', {
        ...meta,
        err,
      })
    }

    throw new ApolloError('Bad response from database', 'DB_ERROR', {
      ...meta,
      reason: 'response error',
      err,
      response: err.response,
      status: err.status,
    })
  }

  const logElasticTiming = (query, internalTime, totalTime) => {
    logger.log(
      {
        query,
        internalTime,
        totalTime,
      },
      {type: 'elastic-timing', level: 'verbose'}
    )
  }

  const _search = (type: string, body: any) => {
    const request = {
      // $FlowFixMe validated above using `validate`
      index: `${ELASTIC_INDEX}.${type}`,
      type,
      body,
    }

    const currentTs = () => new Date().getTime()

    const startTs = currentTs()

    return client
      .search(request)
      .catch((err) => legacyErrorHandler(err, {request}))
      .then((response) => legacyCheckResponse(response, {request}))
      .then((response) => {
        const endTs = currentTs()
        logElasticTiming(request, response.took, endTs - startTs)
        return response
      })
    // Non-legacy version
    //.catch((err) => elasticErrorHandler(err, {request}))
    //.then((response) => checkResponse(response, {request}))
    //.then((response) => response.body)
  }

  const _getCount = async (type: string, query: any) => {
    const {hits} = await _search(type, {
      query,
      size: 0,
    })

    return hits.total
  }

  const _getFirstHit = async (type: string, query: any, sort: any, _source: any) => {
    const {hits} = await _search(type, {
      query,
      sort,
      size: 1,
      ...(_source ? {_source} : {}),
    })

    assert(hits.total >= 1, 'Expected at least a single result')
    return hits.hits[0]
  }

  const _getSingleHit = async (type: string, query: any, _source: any) => {
    const {hits} = await _search(type, {
      query,
      size: 1,
      ...(_source ? {_source} : {}),
    })

    assert(hits.total <= 1, 'Too many hits')
    if (hits.total === 0) {
      throw new EntityNotFoundError('Entity Not Found', {type, query})
    }
    return hits.hits[0]
  }

  class SearchUsingQuery {
    q: Query
    constructor(arg: string | Query) {
      if (arg instanceof Query) {
        this.q = arg
      } else {
        this.q = new Query(arg)
      }
    }

    filter = (...args: any) => new SearchUsingQuery(this.q.filter(...args))

    sortBy = (...args: any) => new SearchUsingQuery(this.q.sortBy(...args))

    pickFields = (...args: any) => new SearchUsingQuery(this.q.pickFields(...args))

    getSingleHit = () => {
      assert(this.q._sort.length === 0, 'Cannot have sortBy in this query')
      return _getSingleHit(this.q._type, this.q._query, this.q._source)
    }

    getCount = () => {
      assert(this.q._sort.length === 0, 'Cannot have sortBy in this query')
      return _getCount(this.q._type, this.q._query)
    }

    getFirstHit = () => {
      assert(this.q._sort.length > 0, 'Must have sortBy')
      return _getFirstHit(this.q._type, this.q._query, E.orderBy(this.q._sort), this.q._source)
    }

    getHits = async (pageSize: number) => {
      assert(pageSize)
      const {hits} = await _search(this.q._type, {
        query: this.q._query,
        size: pageSize,
        sort: E.orderBy(this.q._sort),
        ...(this.q._source ? {_source: this.q._source} : {}),
      })
      assert(hits.hits.length <= pageSize)
      return hits
    }

    getAggregations = async (defs: any) => {
      const {aggregations: response} = await _search(this.q._type, {
        query: this.q._query,
        size: 0,
        aggs: E.agg._encode(defs),
      })

      return E.agg._decode(defs, response)
    }
  }

  return {
    q: (q: string | Query) => new SearchUsingQuery(q),
    rawSearch: _search,
    E,
  }
}

// TODO: how to type better?
export type Elastic = {|
  q: Function,
  rawSearch: Function,
  E: typeof E,
|}

export default getElastic
