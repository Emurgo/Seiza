import React from 'react'
import {Switch, Route} from 'react-router-dom'

import {routeTo} from '@/helpers/routes'

import Transaction from './Transaction'
import Address from './Address'
import Block from './Block'
import PagedBlocks from './PagedBlocks'
import BlockchainHeader from './BlockchainHeader'

export default (props) => (
  <React.Fragment>
    <BlockchainHeader />
    <Switch>
      <Route exact path={routeTo.blockchain()} component={PagedBlocks} />
      <Route path={routeTo.transaction(':txHash')} component={Transaction} />
      <Route path={routeTo.block(':blockHash')} component={Block} />
      <Route path={routeTo.address(':address58')} component={Address} />
    </Switch>
  </React.Fragment>
)
