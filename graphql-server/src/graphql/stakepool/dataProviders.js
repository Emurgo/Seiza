import _ from 'lodash'
import assert from 'assert'

import BOOTSTRAP_POOLS from './mockedPools'

export const fetchBootstrapEraPoolSummary = (api, poolHash, epochNumber) => {
  // TODO: use epochNumber when live data is available if needed
  // to show something some info from summary after some certificate action
  const pool = BOOTSTRAP_POOLS[poolHash]
  assert(pool != null)
  return pool.summary
}

export const fetchBootstrapEraPool = (api, poolHash, epochNumber) => {
  const pool = BOOTSTRAP_POOLS[poolHash]
  assert(pool !== null)
  return {
    // Note: We currently behave like if we expected separate request for summary
    ..._.omit(pool, 'summary'),
    _epochNumber: epochNumber,
  }
}

export const fetchBootstrapEraPoolList = (api, epochNumber) => {
  return _.keys(BOOTSTRAP_POOLS).map((poolHash) =>
    fetchBootstrapEraPool(api, poolHash, epochNumber)
  )
}
