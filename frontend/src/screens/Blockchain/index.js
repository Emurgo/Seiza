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
// TODO: refactor Staking key folders
import StakingKey from './StakingKey/User'
import Slot from './Block/Slot'
import NotFound from './NotFound'
import SearchResults from './SearchResults'

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
      {renderRouteDef({path: routeTo.searchResults(), component: SearchResults})}
      {renderRouteDef({path: routeTo.stakepool(':poolHash'), component: StakePool})}
      {renderRouteDef({path: routeTo.stakingKey(':stakingKey'), component: StakingKey})}
      <Route component={NotFound} />
    </Switch>
  </React.Fragment>
)
