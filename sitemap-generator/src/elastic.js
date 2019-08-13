const {Client: LegacyClient} = require('elasticsearch')

const httpAWSES = require('http-aws-es')
const AWS = require('aws-sdk')
const assert = require('assert')
const https = require('https')

const ELASTIC_URL = process.env.ELASTIC_URL
const ELASTIC_INDEX = process.env.ELASTIC_INDEX

const validate = (cond, msg, ctx) => {
  if (!cond) throw new Error(msg + JSON.stringify(ctx))
}

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
    // eslint-disable-next-line no-console
    console.info('using aws auth')
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
    // eslint-disable-next-line no-console
    console.info('using normal http')
    const plainClient = new LegacyClient({host: ELASTIC_URL})
    return plainClient
  }
}

const client = getClient()

const getElastic = (logger) => {
  const legacyCheckResponse = (response, meta = {}) => {
    assert(response._shards != null)

    validate(response._shards.failed === 0, 'Bad response from elastic', {
      response,
    })

    return response
  }

  const scrollingSearch = (type, body) => {
    let response = null
    let cnt = 0

    const fetchInitial = (type, body) => {
      const request = {
        // $FlowFixMe validated above using `validate`
        index: `${ELASTIC_INDEX}.${type}`,
        type,
        body,
        scroll: '1m', // scroll timeout
      }

      return client.search(request).then((response) => legacyCheckResponse(response, {request}))
    }

    const fetchMore = (prevResponse) => {
      return client
        .scroll({
          scrollId: prevResponse._scroll_id,
          scroll: '1m', // scroll timeout
        })
        .then((response) => legacyCheckResponse(response, {prevResponse}))
    }

    const processAndReturnIteratorValue = (resp) => {
      response = resp
      cnt += resp.hits.hits.length

      return {
        value: {
          hits: resp.hits.hits,
          total: resp.hits.total,
          cntDone: cnt,
        },
        done: !resp.hits.hits.length,
      }
    }

    return {
      [Symbol.asyncIterator]: () => ({
        next: () => {
          if (!response) {
            return fetchInitial(type, body).then(processAndReturnIteratorValue)
          } else {
            return fetchMore(response).then(processAndReturnIteratorValue)
          }
        },
      }),
    }
  }

  return {
    scrollingSearch,
  }
}

module.exports = getElastic(console)
