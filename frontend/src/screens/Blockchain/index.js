import React from 'react'
import dynamic from 'next/dynamic'
import {Switch, Route} from 'react-router-dom'

import {routeTo} from '@/helpers/routes'
import SyncIssuesBar from '@/components/common/SyncIssuesBar'

import PagedBlocks from './PagedBlocks'
import NotFound from './NotFound'
import SearchResults from './SearchResults'

import {LoadingInProgress} from '@/components/visual'

const lazyLoadingConfig = {loading: LoadingInProgress}

const Epoch = dynamic(() => import('./Epoch'), lazyLoadingConfig)
const Transaction = dynamic(() => import('././Transaction'), lazyLoadingConfig)
const Block = dynamic(() => import('./Block'), lazyLoadingConfig)
const Address = dynamic(() => import('./Address'), lazyLoadingConfig)
const StakePool = dynamic(() => import('./Stakepool'), lazyLoadingConfig)
const StakingKey = dynamic(() => import('./StakingKey'), lazyLoadingConfig)
const Slot = dynamic(() => import('./Block/Slot'), lazyLoadingConfig)

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
