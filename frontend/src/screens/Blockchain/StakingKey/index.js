import React from 'react'
import {withRouter} from 'react-router'
import {withProps} from 'recompose'

import {compose} from 'redux'
import {Switch, Route, Redirect} from 'react-router-dom'

import NotFound from '@/screens/PageNotFound'
import {routeTo} from '@/helpers/routes'
import StakePool from './Pool'
import UserStakingKey from './User'

const StakingKey = ({location, stakingKeyHash}) => {
  // TODO: do check to decide which link to redirect to
  // TODO: TEMPORARY to be able to see that this logic is working
  const isStakingPoolType = location.search === '?pool'
  const to = isStakingPoolType
    ? routeTo.stakingKey.stakePool(stakingKeyHash)
    : routeTo.stakingKey.user(stakingKeyHash)

  return (
    <Switch>
      <Route path={routeTo.stakingKey.user(':stakingKey')} component={UserStakingKey} />
      <Route path={routeTo.stakingKey.stakePool(':stakingKey')} component={StakePool} />
      <Redirect to={to} />
      <NotFound />
    </Switch>
  )
}

export default compose(
  withRouter,
  withProps((props) => ({
    stakingKeyHash: props.match.params.stakingKey,
  }))
)(StakingKey)
