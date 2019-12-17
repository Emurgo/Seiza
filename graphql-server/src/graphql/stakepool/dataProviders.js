import _ from 'lodash'
import assert from 'assert'
import moment from 'moment'
import adaAmount from '../scalars/adaAmount'

const genFloatInRange = (from, to) => from + Math.random() * (to - from)
const genIntInRange = (from, to) => Math.floor(genFloatInRange(from, to))
const ADA_DECIMALS = 1000000
const PAGE_SIZE = 10

const JORMUNGANDER_UNIX_TIMESTAMP_SEC = 1576246417
// NOTE(Nico): Rewards estimates are from https://staking.cardano.org/en/calculator/
const dailyRewardPerADA = 0.000197
const dailyRewardPercentage = 0.019666
const revenueBaseValue = 100000
const daysPerEpoch = 1
const yearlyRewards = 0.071783
const yearlyRewardsPercentage = 7.178316

// TODO: this is wrong, but IOHK did it this way -- not compounding
const dailyToAnnualAdaRewards = (adaAmount, marginStakepool, costStakepool) => {
  return dailyAdaRewards(adaAmount, marginStakepool, costStakepool) * 365
}
const dailyToMonthlyAdaRewards = (adaAmount, marginStakepool, costStakepool) => {
  return dailyAdaRewards(adaAmount, marginStakepool, costStakepool) * 30
}
const dailyAdaRewards = (adaAmount, marginStakepool, costStakepool) => {
  return (dailyRewardPercentage * (1 - marginStakepool) * adaAmount) / 100
}

const revenue = (adaAmount, marginStakepool, costStakepool) => {
  return (
    1.0 *
    ((dailyRewardPercentage * (1 - marginStakepool) * revenueBaseValue - costStakepool) /
      (dailyRewardPercentage * adaAmount))
  )
}

const appendWebsiteIfAvailable = (description, website) => {
  if (description !== null) {
    return `${description} website: ${website}`
  } else {
    if (website !== null) {
      return `Website: ${website}`
    } else {
      return null
    }
  }
}

// TODO: I also need the ADA that’s part of the URL
const mapToStandarizedPool = (res, adaAmount) => {
  // console.log(`mapToStandarizedPool::${res.pool_id}`)
  // console.log(res)

  const name =
    res.github_info !== null
      ? `(${res.github_info.info.ticker}) ${res.github_info.info.name}`
      : null
  const website = res.github_info !== null ? res.github_info.info.homepage : null
  const description =
    res.github_info !== null
      ? appendWebsiteIfAvailable(res.github_info.info.description, website)
      : 'No description.'

  const margin = Math.round((100.0 * res.rewards.ratio[0]) / res.rewards.ratio[1]) / 100.0
  const cost = res.rewards.fixed

  return {
    poolHash: res.pool_id,
    createdAt: moment((JORMUNGANDER_UNIX_TIMESTAMP_SEC + res.start_validity) * 1000),
    name,
    description,
    website,
    summary: {
      adaStaked: res.delegation_after_this_tx,
      keysDelegating: 100 + genIntInRange(0, 100), // TODO: fix
      performance: 0.71 + genFloatInRange(-0.3, 0.2), // TODO: fix
      rewards: `${genIntInRange(0, 100000 * ADA_DECIMALS)}`,
      estimatedRewards: {
        perYear: {
          percentage: dailyRewardPercentage * (1 - margin) * 365,
          ada: Math.ceil(dailyToAnnualAdaRewards(adaAmount, margin, cost)),
        },
        perMonth: {
          percentage: dailyRewardPercentage * (1 - margin) * 30,
          ada: Math.ceil(dailyToMonthlyAdaRewards(adaAmount, margin, cost)),
        },
        perEpoch: {
          percentage: dailyRewardPercentage * (1 - margin),
          ada: Math.ceil(dailyAdaRewards(adaAmount, margin, cost)),
        },
      },
      cost,
      fullness: 0.6 + genFloatInRange(-0.3, 0.2), // TODO: fix
      margins: margin,
      revenue: revenue(adaAmount, margin, cost),
      stakersCount: res.owners.length,
      ownerPledge: {
        declared: '14243227',
        actual: '14243227',
      },
      profitabilityPosition: 1,
    },
  }
}

// TODO(Nico): Enable for Seiza
// const fetchPool = async ({elastic, E}, hash) => {
//   // const res = await elastic
//   //   .q('leader')
//   //   .filter(E.eq('leadId', hash))
//   //   .getSingleHit()
//   // return mapResToAPool(res)
//   // TODO: Fix this
//   // const pools = await fetchPoolList({elastic, E}, 0)
//   // pools[0].poolHash = hash
//   console.log("Fetch pool yaya")
//   return null
// }

const getPoolInfo = async ({elastic, owners}) => {
  const extractData = (result) => (result.hits.total > 0 ? result.hits.hits[0]._source : null)
  const ownerToRequest = (owner) => {
    return elastic.rawSearch('pool-owner-info', poolOwnerRequestBody(owner))
  }

  const ownersRequest = owners.map(ownerToRequest)
  const res = await Promise.all(ownersRequest)

  const poolInfoPerOwner = res.map(extractData)
  return poolInfoPerOwner !== null && poolInfoPerOwner.length > 0 ? poolInfoPerOwner[0] : null
}

// TODO: Check for pagination
export const fetchPoolList = async ({elastic, E}, adaAmount) => {
  // console.log('AdaAmount')
  // console.log(adaAmount)

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

  const poolsData = extractData(res[0].aggregations)
  const delegationData = extractData(res[1].aggregations)

  const delegationHashmap = delegationData.reduce((map, delegate) => {
    map[delegate.pool_id] = delegate.delegation_after_this_tx.full
    return map
  }, {})

  const githubPoolsPromises = poolsData.map((pool) => getPoolInfo({elastic, owners: pool.owners}))

  const githubPoolsInfoArray = await Promise.all(githubPoolsPromises)

  const githubPoolsInfoHashmap = githubPoolsInfoArray.filter(Boolean).reduce((map, pool) => {
    map[pool.owner] = pool
    return map
  }, {})

  const pools = poolsData
    .map((pool) => {
      const github_info = pool.owners.map((owner) => githubPoolsInfoHashmap[owner]).filter(Boolean)

      return {
        ...pool,
        github_info: github_info.length > 0 ? github_info[0] : null,
        delegation_after_this_tx:
          delegationHashmap && delegationHashmap[pool.pool_id] !== null
            ? Number(delegationHashmap[pool.pool_id])
            : 0,
      }
    })
    .map((pool) => mapToStandarizedPool(pool, adaAmount.toNumber() * ADA_DECIMALS))

  // console.log('POOLS!!')
  // console.log(pools)

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
                size: 10000,
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
                size: 10000,
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

const poolOwnerRequestBody = (ownerId) => {
  return {
    query: {
      term: {
        owner: ownerId,
      },
    },
    sort: {
      time: {
        order: 'desc',
      },
    },
  }
}
