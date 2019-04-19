// @flow
import {Client, errors as ElasticsearchErrors} from '@elastic/elasticsearch'
import legacyClient from 'elasticsearch'
import httpAWSES from 'http-aws-es'
import AWS from 'aws-sdk'
import {ApolloError} from 'apollo-server'
import assert from 'assert'
import E from './elasticHelpers'
import type {SortDirection} from './elasticHelpers'

assert(process.env.ELASTIC_URL, 'Please provide $ELASTIC_URL env variable')
const ELASTIC_URL = process.env.ELASTIC_URL
assert(process.env.ELASTIC_INDEX, 'Please provide ELASTIC_INDEX env variable')
const ELASTIC_INDEX = process.env.ELASTIC_INDEX

// if AWS credentials were provided via env, we use 'aws-elasticsearch-client'
const getClient = () => {
  if (
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION
  ) {
    const options = {
      host: ELASTIC_URL,
      // HACK: this is not used, it's just to avoid eslint warn...
      index: ELASTIC_INDEX,
      credentials: new AWS.Credentials({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }),
    }

    const config = Object.assign({}, options, {
      connectionClass: httpAWSES,
      awsConfig: new AWS.Config({
        region: process.env.AWS_REGION,
        credentials: options.credentials,
      }),
    })

    const awsClient = new legacyClient.Client(config)
    return awsClient
  } else {
    const plainClient = new Client({node: ELASTIC_URL})
    return plainClient
  }
}

const client = getClient()

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

const _search = (type: string, body: any) => {
  const request = {
    index: `{ELASTIC_INDEX}.${type}`,
    type,
    body,
  }

  return client
    .search(request)
    .catch((err) => elasticErrorHandler(err, {request}))
    .then((response) => checkResponse(response, {request}))
    .then((response) => response.body)
}

const _getCount = async (type: string, query: any) => {
  const {hits} = await _search(type, {
    query,
    size: 0,
  })

  return hits.total
}

const _getFirstHit = async (type: string, query: any, sort: any) => {
  const {hits} = await _search(type, {
    query,
    sort,
    size: 1,
  })

  assert(hits.total >= 1, 'Expected at least a single result')
  return hits.hits[0]
}

const _getSingleHit = async (type: string, query: any) => {
  const {hits} = await _search(type, {
    query,
    size: 1,
  })

  assert(hits.total <= 1, 'Too many hits')
  assert(hits.total > 0, 'TODO: Throw better error here')
  return hits.hits[0]
}

class Query {
  _type: string
  _filter: Array<any>
  _sort: Array<any>

  constructor(type: string, _filter: Array<any> = [], _sort: Array<any> = []) {
    this._type = type
    this._filter = _filter
    this._sort = _sort
  }

  filter = (condition: any) => {
    return new Query(this._type, [...this._filter, condition], this._sort)
  }

  sortBy = (field: string, order: SortDirection) => {
    return new Query(this._type, this._filter, [...this._sort, [field, order]])
  }

  get _query(): any {
    return {
      bool: {
        filter: this._filter.filter((c) => !!c),
      },
    }
  }

  getSingleHit = () => {
    assert(this._sort.length === 0, 'Cannot have sortBy in this query')
    return _getSingleHit(this._type, this._query)
  }

  getCount = () => {
    assert(this._sort.length === 0, 'Cannot have sortBy in this query')
    return _getCount(this._type, this._query)
  }

  getFirstHit = () => {
    assert(this._sort.length > 0, 'Must have sortBy')
    return _getFirstHit(this._type, this._query, E.orderBy(this._sort))
  }

  getHits = async (pageSize: number) => {
    assert(pageSize)
    const {hits} = await _search(this._type, {
      query: this._query,
      size: pageSize,
      sort: E.orderBy(this._sort),
    })
    assert(hits.hits.length <= pageSize)
    return hits
  }

  getAggregations = async (defs: any) => {
    const {aggregations: response} = await _search(this._type, {
      query: this._query,
      size: 0,
      aggs: E.agg._encode(defs),
    })

    return E.agg._decode(defs, response)
  }
}

const elastic = {
  q: (type: string) => new Query(type),
  rawSearch: _search,
  E,
}

export type Elastic = typeof elastic

export default elastic
