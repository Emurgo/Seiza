// @flow
import React from 'react'

import useReactRouter from 'use-react-router'

import NonBootstrapPool from './NonBootstrapPool'
import BootstrapPool from './BootstrapPool/index'

// Note: We check directly for this hash (link from More screen)
// to access mocked stakepool (non-bootstrap)
// TODO: remove NON_BOOTSTRAP_POOL_HASH once we have real data
export const NON_BOOTSTRAP_POOL_HASH =
  'eccbc87e4b5ce2fe28308fd9f2a7baf3a87ff679a2f3e71d9181a67b7542122c'

const StakePool = () => {
  const {
    match: {
      params: {poolHash},
    },
  } = useReactRouter()
  // TODO: remove NON_BOOTSTRAP_POOL_HASH once we have real data
  return poolHash === NON_BOOTSTRAP_POOL_HASH ? (
    <NonBootstrapPool />
  ) : (
    <BootstrapPool poolHash={poolHash} />
  )
}

export default StakePool
