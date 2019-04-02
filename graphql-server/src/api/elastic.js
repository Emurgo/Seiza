// @flow
import {Client, errors as ElasticsearchErrors} from '@elastic/elasticsearch'
import {ApolloError} from 'apollo-server'
import assert from 'assert'

// TODO: make this configurable
const ELASTIC_URL =
  'https://search-seiza-rustic-dev-kjf5rokepsughyjv7ejnorlvx4.us-west-1.es.amazonaws.com'

const client = new Client({node: ELASTIC_URL})

// This checks elastic response for validaty.
// For now we prefer to be rather strict than to return partial data
const checkResponse = (response: any) => {
  if (response.statusCode !== 200) {
    throw new ApolloError('Bad response from database', 'DB_ERROR', {response})
  }

  if (response.warnings != null) {
    throw new ApolloError('Bad response from database', 'DB_ERROR', {response})
  }

  assert(response.body != null)
  assert(response.body._shards != null)

  if (response.body._shards.failed !== 0) {
    throw new ApolloError('Bad response from database', 'DB_ERROR', {response})
  }

  return response
}

// Converts elasticsearch Client error into ApolloError
// Note that this is called only when request totally afails/times out
// and we do not get *any* response.
const elasticErrorHandler = (err) => {
  assert(err instanceof ElasticsearchErrors.ElasticsearchClientError)
  // TODO: maybe distinguish between the errors from
  // https://github.com/elastic/elasticsearch-js/blob/master/lib/errors.js

  // eslint-disable-next-line no-console
  console.dir(err, {depth: 3})

  throw new ApolloError('Could not reach database', 'DB_UNREACHABLE', {err})
}

type SearchParams = {
  index?: string,
  type?: string,
  body: any,
}

type SortDirection = 'asc' | 'desc'

const elastic = {
  search: (params: SearchParams) => {
    // eslint-disable-next-line
    console.dir(params, {depth: null})
    return client
      .search(params)
      .catch(elasticErrorHandler)
      .then(checkResponse)
      .then((response) => response.body)
  },
  // Elastic query syntax seems to be ad-hoc and too verbose
  // it is better to have some wrappers
  _orderBy: (fields: Array<[string, SortDirection]>): any =>
    fields.map(([field, order]) => ({
      [field]: {order},
    })),
  _notNull: (field: string) => ({
    exists: {
      field,
    },
  }),
  // Use for hash search -- seems to be case-insensitive exact match
  // for them
  _matchPhrase: (field: string, phrase: string) => ({
    match_phrase: {
      [field]: phrase,
    },
  }),

  _lte: (field: string, value: any) => ({
    range: {
      [field]: {
        lte: value,
      },
    },
  }),
  _lt: (field: string, value: any) => ({
    range: {
      [field]: {
        lt: value,
      },
    },
  }),
  _exact: (field: string, value: any) => ({
    term: {
      [field]: value,
    },
  }),
  _onlyActiveFork: () => ({
    term: {
      branch: 0,
    },
  }),
  _filter: (conditions: Array<any>): any => ({
    bool: {
      filter: conditions.map((c) => !!c),
    },
  }),

  _sum: (field: string) => ({
    sum: {
      field,
    },
  }),
}

export default elastic
