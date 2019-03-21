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

  throw new ApolloError('Could not reach database', 'DB_UNREACHABLE', {err})
}

type SearchParams = {
  index?: string,
  type?: string,
  body: any,
}

const elastic = {
  search: (params: SearchParams) =>
    client
      .search(params)
      .catch(elasticErrorHandler)
      .then(checkResponse)
      .then((response) => response.body),
}

export default elastic
