// @flow

import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {compose} from 'redux'
import {Grid, createStyles, withStyles} from '@material-ui/core'

import {routeTo} from '@/helpers/routes'
import {stakingContextProvider, withSyncListScreenWithUrl} from './context'
import SideMenu from './SideMenu'
import StakePoolList from './StakeList'
import StakePoolHeader from './Header'
import PageNotFound from '../PageNotFound'

const styles = () =>
  createStyles({
    sidebar: {
      maxWidth: '450px',
    },
    notFound: {
      marginTop: '100px',
    },
    wrapper: {
      // TODO: consider a better solution to avoid scroll bars
      overflow: 'hidden',
    },
  })

const NotFound = withStyles(styles)(({classes}) => (
  <div className={classes.notFound}>
    <PageNotFound />
  </div>
))

// Note: URL vs Storage: no merging: either url or localStorage wins
const ListScreenRoute = compose(withSyncListScreenWithUrl)(
  ({location: {search: urlQuery}, syncListScreenWithUrl, getListScreenUrlQuery}) => {
    const storageQuery = getListScreenUrlQuery()
    if (urlQuery) {
      // TODO: consider better than equality check to avoid unnecessary sync
      urlQuery !== storageQuery && syncListScreenWithUrl(urlQuery)
      return <StakePoolList />
    } else {
      return storageQuery ? (
        <Redirect exact to={`${routeTo.staking.poolList()}${storageQuery}`} />
      ) : (
        <StakePoolList />
      )
    }
  }
)

export default compose(
  withStyles(styles),
  stakingContextProvider
)(({classes}) => (
  <Grid container direction="column" className={classes.wrapper}>
    <StakePoolHeader />
    <Grid container direction="row" wrap="nowrap" spacing={24}>
      <Grid item lg={3} xl={3}>
        <div className={classes.sidebar}>
          <SideMenu />
        </div>
      </Grid>
      <Grid item lg={9} xl={6} className={classes.mainContent}>
        <Switch>
          <Redirect exact from={routeTo.staking.home()} to={routeTo.staking.poolList()} />
          <Route exact path={routeTo.staking.poolList()} render={ListScreenRoute} />
          <Route component={NotFound} />
        </Switch>
      </Grid>
      <Grid item lg={0} xl={3} />
    </Grid>
  </Grid>
))
