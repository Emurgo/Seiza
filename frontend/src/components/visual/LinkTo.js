// @flow
import React from 'react'
import Link from './Link'

import {routeTo} from '../../helpers/routes'

const LINKS_TO_BLOCKCHAIN = false

// mirrors routesTo object topology
const LinkTo = {
  // home
  // blockchain
  transaction: ({txHash, children}: {txHash: string, children: any}) =>
    LINKS_TO_BLOCKCHAIN ? <Link to={routeTo.transaction(txHash)}>{children}</Link> : children,
  block: ({blockHash, children}: {blockHash: string, children: any}) =>
    LINKS_TO_BLOCKCHAIN ? <Link to={routeTo.transaction(blockHash)}>{children}</Link> : children,
  // slot
  // address
  stakepool: ({poolHash, children}: {poolHash: string, children: any}) =>
    LINKS_TO_BLOCKCHAIN ? <Link to={routeTo.stakepool(poolHash)}>{children}</Link> : children,
  epoch: ({epochNumber, children}: {epochNumber: number, children: any}) =>
    LINKS_TO_BLOCKCHAIN ? <Link to={routeTo.epoch(epochNumber)}>{children}</Link> : children,
  stakingKey: ({stakingKey, children}: {stakingKey: string, children: any}) =>
    LINKS_TO_BLOCKCHAIN ? (
      <Link to={routeTo.stakingKey.user(stakingKey)}>{children}</Link>
    ) : (
      children
    ),
}

export default LinkTo
