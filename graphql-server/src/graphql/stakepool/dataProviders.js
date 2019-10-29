import _ from 'lodash'
import assert from 'assert'

import moment from 'moment'
import {facadeElasticBlock} from '../block/dataProviders'

const BYRON_MAINNET_START_TIME_SEC = 1506203091
const GENESIS_UNIX_TIMESTAMP_SEC = parseInt(
  process.env.GENESIS_UNIX_TIMESTAMP_SEC || BYRON_MAINNET_START_TIME_SEC,
  10
)
const BOOTSTRAP_TS = GENESIS_UNIX_TIMESTAMP_SEC * 1000

const genFloatInRange = (from, to) => from + Math.random() * (to - from)
const genIntInRange = (from, to) => Math.floor(genFloatInRange(from, to))
const ADA_DECIMALS = 1000000
const PAGE_SIZE = 2

const mapResToAPool = (res) => {
  return {
    poolHash: res._source.leadId,
    createdAt: moment(BOOTSTRAP_TS),
    name: res._source.name,
    description: res._source.description,
    website: 'https://www.cardano.org/en/home/',
    summary: {
      adaStaked: `${genIntInRange(0, 100000000 * ADA_DECIMALS)}`,
      keysDelegating: 100 + genIntInRange(0, 100),
      performance: 0.71 + genFloatInRange(-0.3, 0.2),
      rewards: `${genIntInRange(0, 100000 * ADA_DECIMALS)}`,
      cost: `${genIntInRange(0, 100000 * ADA_DECIMALS)}`,
      fullness: 0.6 + genFloatInRange(-0.3, 0.2),
      margins: 0.3 + genFloatInRange(-0.1, 0.1),
      revenue: 0.82 + genFloatInRange(-0.1, 0.1),
      stakersCount: 3 + genIntInRange(-2, 10),
      ownerPledge: {
        declared: '14243227',
        actual: '14243227',
      },
      profitabilityPosition: 4,
    },
  }
}

const fetchPool = async ({elastic, E}, hash) => {
  const res = await elastic
    .q('leader')
    .filter(E.eq('leadId', hash))
    .getSingleHit()
  return mapResToAPool(res)
}

export const fetchBootstrapEraPoolSummary = async (context, poolHash, epochNumber) => {
  // TODO: use epochNumber when live data is available if needed
  // to show something some info from summary after some certificate action
  const pool = await fetchPool(context, poolHash)
  assert(pool != null)
  return pool.summary
}

export const fetchBootstrapEraPool = async (context, poolHash, epochNumber) => {
  const pool = await fetchPool(context, poolHash)
  assert(pool != null)
  return {
    // Note: We currently behave like if we expected separate request for summary
    ..._.omit(pool, 'summary'),
    _epochNumber: epochNumber,
  }
}

export const fetchBootstrapEraPoolList = async ({elastic, E}, epochNumber) => {
  const res = await elastic.q('leader').getHits(PAGE_SIZE)
  const pools = res.hits.map(mapResToAPool)
  assert(pools.length > 0)
  return pools
}
