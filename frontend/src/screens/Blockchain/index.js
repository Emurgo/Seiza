import React from 'react'
import {Switch, Route} from 'react-router-dom'

import {routeTo} from '@/helpers/routes'

import Transaction from './Transaction'
import Address from './Address'
import Block from './Block'
import PagedBlocks from './PagedBlocks'
import BlockchainHeader from './BlockchainHeader'
import PageNotFound from '../PageNotFound'
import Search from './Search'
import StakePool from './StakePool'

export default (props) => (
  <React.Fragment>
    <BlockchainHeader />
    <Switch>
      <Route exact path={routeTo.blockchain()} component={PagedBlocks} />
      <Route path={routeTo.transaction(':txHash')} component={Transaction} />
      <Route path={routeTo.block(':blockHash')} component={Block} />
      <Route path={routeTo.address(':address58')} component={Address} />
      <Route path={routeTo.search(':query')} component={Search} />
      <Route path={routeTo.stakepool(':poolHash')} component={StakePool} />
      <Route component={PageNotFound} />
    </Switch>
  </React.Fragment>
)
