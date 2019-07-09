import React from 'react'
import useReactRouter from 'use-react-router'
import {Switch, Route, Redirect} from 'react-router-dom'

import NotFound from '@/screens/PageNotFound'
import {routeTo} from '@/helpers/routes'
import StakePool from './Pool'
import UserStakingKey from './User'

const StakingKey = () => {
  const {location, match} = useReactRouter()
  const stakingKeyHash = match.params.stakingKey
  // TODO: check to decide which link to redirect to
  // TODO: TEMPORARY to be able to see that this logic is working
  const isStakingPoolType = location.search === '?pool'
  const to = isStakingPoolType
    ? routeTo.stakepool(stakingKeyHash)
    : routeTo.stakingKey(stakingKeyHash)

  return (
    <Switch>
      <Route path={routeTo.stakingKey(':stakingKey')} component={UserStakingKey} />
      <Route path={routeTo.stakepool(':stakingKey')} component={StakePool} />
      <Redirect to={to} />
      <NotFound />
    </Switch>
  )
}

export default StakingKey
