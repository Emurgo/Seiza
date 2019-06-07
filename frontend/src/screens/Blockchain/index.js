import React from 'react'
import {Switch, Route} from 'react-router-dom'

import {routeTo} from '@/helpers/routes'
import SyncIssuesBar from '@/components/common/SyncIssuesBar'

import Transaction from './Transaction'
import Address from './Address'
import Epoch from './Epoch'
import Block from './Block'
import PagedBlocks from './PagedBlocks'
import StakePool from './StakePool'
import StakingKey from './StakingKey'
import Slot from './Block/Slot'
import NotFound from './NotFound'

const renderRouteDef = ({path, ...rest}) => (path ? <Route path={path} {...rest} /> : null)

export default (props) => (
  <React.Fragment>
    <SyncIssuesBar />
    <Switch>
      {renderRouteDef({exact: true, path: routeTo.blockchain(), component: PagedBlocks})}
      {renderRouteDef({path: routeTo.transaction(':txHash'), component: Transaction})}
      {renderRouteDef({path: routeTo.block(':blockHash'), component: Block})}
      {renderRouteDef({path: routeTo.slot(':epoch', ':slot'), component: Slot})}
      {renderRouteDef({path: routeTo.address(':address58'), component: Address})}
      {renderRouteDef({path: routeTo.epoch(':epoch'), component: Epoch})}

      {renderRouteDef({path: routeTo.stakepool(':poolHash'), component: StakePool})}
      {/* TODO: should staking key be here? See notes in routeTo */}
      {renderRouteDef({path: routeTo.stakingKey.home(':stakingKey'), component: StakingKey})}
      <Route component={NotFound} />
    </Switch>
  </React.Fragment>
)
