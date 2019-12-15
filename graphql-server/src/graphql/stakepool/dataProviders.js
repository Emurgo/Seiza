import _ from 'lodash'
import assert from 'assert'

import moment from 'moment'

const BYRON_MAINNET_START_TIME_SEC = 1506203091
const GENESIS_UNIX_TIMESTAMP_SEC = parseInt(
  process.env.GENESIS_UNIX_TIMESTAMP_SEC || BYRON_MAINNET_START_TIME_SEC,
  10
)
const BOOTSTRAP_TS = GENESIS_UNIX_TIMESTAMP_SEC * 1000

const genFloatInRange = (from, to) => from + Math.random() * (to - from)
const genIntInRange = (from, to) => Math.floor(genFloatInRange(from, to))
const ADA_DECIMALS = 1000000
const PAGE_SIZE = 10

const mapToStandarizedPool = (res) => {
  console.log(`mapToStandarizedPool::${res.pool_id}`)
  console.log(res)
  return {
    poolHash: res.pool_id,
    createdAt: moment(BOOTSTRAP_TS), // TODO: fix
    name: res.pool_id.slice(0, 5), // TODO: fix
    description: `${res.keys.kes_bech32} ${res.keys.vrf_bech32}`, // TODO: fix
    website: 'https://www.cardano.org/en/home/', // TODO: fix
    summary: {
      adaStaked: res.delegation_after_this_tx,
      keysDelegating: 100 + genIntInRange(0, 100), // TODO: fix
      performance: 0.71 + genFloatInRange(-0.3, 0.2), // TODO: fix
      rewards: `${genIntInRange(0, 100000 * ADA_DECIMALS)}`,
      estimatedRewards: {
        perYear: {
          percentage: 0.8232323,
          ada: '432543',
        },
        perMonth: {
          percentage: 0.2132323,
          ada: '4321',
        },
        perEpoch: {
          percentage: 0.1232323,
          ada: '432',
        },
      },
      cost: res.rewards.fixed, // TODO: Check that’s in lovelace
      fullness: 0.6 + genFloatInRange(-0.3, 0.2), // TODO: fix
      margins: 0.3 + genFloatInRange(-0.1, 0.1), // TODO: fix
      revenue: 0.82 + genFloatInRange(-0.1, 0.1), // TODO: fix
      stakersCount: 3 + genIntInRange(-2, 10), // TODO: fiix
      ownerPledge: {
        declared: '14243227',
        actual: '14243227',
      },
      profitabilityPosition: 1,
    },
  }
}

const fetchPool = async ({elastic, E}, hash) => {
  // const res = await elastic
  //   .q('leader')
  //   .filter(E.eq('leadId', hash))
  //   .getSingleHit()
  // return mapResToAPool(res)
  // TODO: Fix this
  const pools = await fetchPoolList({elastic, E}, 0)
  pools[0].poolHash = hash
  return pools[0]
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

// TODO: Check for pagination
export const fetchPoolList = async ({elastic, E}, epochNumber) => {
  const extractData = (aggregations) => {
    const {buckets} = aggregations.tmp_nest.tmp_filter.tmp_group_by
    return buckets.map((buck) => {
      const source = buck.tmp_select_latest.hits.hits[0]._source
      return {
        ...source,
      }
    })
  }

  // TODO: Make this pretty. We should use getAggregations and then extend agg with
  // the respective encode and decode for every parameter :sweat_smile:
  const poolsPromise = await elastic.rawSearch('tx', poolsRequestBody)
  const poolsDelegationPromise = await elastic.rawSearch('tx', poolsDelegationRequestBody)

  const res = await Promise.all([poolsPromise, poolsDelegationPromise])
  // console.log(res)

  const poolsData = extractData(res[0].aggregations)
  const delegationData = extractData(res[1].aggregations)
  // console.log(poolsData)
  // console.log(delegationData)

  const delegationHashmap = delegationData.reduce((map, delegate) => {
    map[delegate.pool_id.toString()] = delegate.delegation_after_this_tx.full
    return map
  }, {})

  // console.log("delegation hashmap")
  // console.log(delegationHashmap)

  const pools = poolsData
    .map((pool) => ({
      ...pool,
      delegation_after_this_tx:
        delegationHashmap && delegationHashmap[pool.pool_id] !== null
          ? Number(delegationHashmap[pool.pool_id])
          : 0,
    }))
    .map(mapToStandarizedPool)

  console.log('POOLS!!')
  console.log(pools)

  assert(pools.length > 0)
  return pools
}

const poolsDelegationRequestBody = {
  size: 0,
  aggs: {
    tmp_nest: {
      nested: {
        path: 'delegation',
      },
      aggs: {
        tmp_filter: {
          filter: {
            exists: {
              field: 'delegation.pool_id.keyword',
            },
          },
          aggs: {
            tmp_group_by: {
              terms: {
                field: 'delegation.pool_id.keyword',
              },
              aggs: {
                tmp_select_latest: {
                  top_hits: {
                    size: 1,
                    sort: {
                      'delegation.state_ordinal': {
                        order: 'desc',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}

const poolsRequestBody = {
  size: 0,
  aggs: {
    tmp_nest: {
      nested: {
        path: 'pools',
      },
      aggs: {
        tmp_filter: {
          filter: {
            exists: {
              field: 'pools.pool_id.keyword',
            },
          },
          aggs: {
            tmp_group_by: {
              terms: {
                field: 'pools.pool_id.keyword',
              },
              aggs: {
                tmp_select_latest: {
                  top_hits: {
                    size: 1,
                    sort: {
                      'pools.state_ordinal': {
                        order: 'desc',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}
