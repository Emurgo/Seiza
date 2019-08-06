const {GraphQLClient} = require('graphql-request')
const http = require('http')
const https = require('https')
const assert = require('assert')

const config = require('./config')

let proto
if (config.URL.startsWith('http://')) proto = http
if (config.URL.startsWith('https://')) proto = https

assert(proto && 'unknown backend url protocol')

const agent = new proto.Agent({
  keepAlive: true,
  keepAliveMsecs: 1500,
  maxSockets: 100,
})

const client = new GraphQLClient(config.URL, {agent})

module.exports = client
