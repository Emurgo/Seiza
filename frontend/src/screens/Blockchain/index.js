import React from 'react'
import {Switch, Route} from 'react-router-dom'

import {routeTo} from '@/helpers/routes'
import SyncIssuesBar from '@/components/common/SyncIssuesBar'
import config from '@/config'

import Transaction from './Transaction'
import Address from './Address'
import Epoch from './Epoch'
import Block from './Block'
import PagedBlocks from './PagedBlocks'
import StakePool from './StakePool'
import StakingKey from './StakingKey'
import Slot from './Block/Slot'
import NotFound from './NotFound'

export default (props) => (
  <React.Fragment>
    <SyncIssuesBar />
    <Switch>
      <Route exact path={routeTo.blockchain()} component={PagedBlocks} />
      <Route path={routeTo.transaction(':txHash')} component={Transaction} />
      <Route path={routeTo.block(':blockHash')} component={Block} />
      <Route path={routeTo.slot(':epoch', ':slot')} component={Slot} />
      <Route path={routeTo.address(':address58')} component={Address} />
      <Route path={routeTo.epoch(':epoch')} component={Epoch} />
      {config.showStakingData && (
        <Route path={routeTo.stakingKey.home(':stakingKey')} component={StakingKey} />
      )}
      <Route path={routeTo.stakepool(':poolHash')} component={StakePool} />
      <Route component={NotFound} />
    </Switch>
  </React.Fragment>
)
