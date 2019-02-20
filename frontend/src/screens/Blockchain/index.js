import React from 'react'
import {Switch, Route} from 'react-router-dom'

import {routeTo} from '../../helpers/routes'

import Transaction from './Transaction'
import Address from './Address'
import Block from './Block'
import PagedBlocks from './PagedBlocks'

import OverviewMetrics from '../Home/OverviewMetrics'
import Search from '../Home/Search'

export default (props) => (
  <React.Fragment>
    <div className="gradient-bg">
      <OverviewMetrics />
      <Search />
    </div>
    <Switch>
      <Route exact path={routeTo.blockchain()} component={PagedBlocks} />
      <Route path={routeTo.transaction(':txHash')} component={Transaction} />
      <Route path={routeTo.block(':blockHash')} component={Block} />
      <Route path={routeTo.address(':address58')} component={Address} />
    </Switch>
  </React.Fragment>
)
