import React from 'react'
import {Grid} from '@material-ui/core'
import {Switch, Route} from 'react-router-dom'

import {routeTo} from '@/helpers/routes'

import Transaction from './Transaction'
import Address from './Address'
import Epoch from './Epoch'
import Block from './Block'
import PagedBlocks from './PagedBlocks'
import BlockchainHeader from './BlockchainHeader'
import PageNotFound from '../PageNotFound'
import StakePool from './StakePool'
import StakingKey from './StakingKey'
import config from '@/config'

// Note: using grid setup it is tricky to center PageNotFound when
// we want 'BlockchainHeader' to be rendered.
// For now using simpler, not perfect styling solution.
const NotFound = () => (
  <div style={{marginTop: '100px', minHeight: '300px'}}>
    <PageNotFound />
  </div>
)

export default (props) => (
  <Grid container direction="column" style={{overflow: 'hidden'}}>
    <BlockchainHeader />
    <Switch>
      <Route exact path={routeTo.blockchain()} component={PagedBlocks} />
      <Route path={routeTo.transaction(':txHash')} component={Transaction} />
      <Route path={routeTo.block(':blockHash')} component={Block} />
      <Route path={routeTo.address(':address58')} component={Address} />
      <Route path={routeTo.epoch(':epoch')} component={Epoch} />
      {config.showStakingData && (
        <Route path={routeTo.stakingKey.home(':stakingKey')} component={StakingKey} />
      )}
      <Route path={routeTo.stakepool(':poolHash')} component={StakePool} />
      <Route component={NotFound} />
    </Switch>
  </Grid>
)
