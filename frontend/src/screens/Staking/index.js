// @flow

import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {compose} from 'redux'
import {Grid, createStyles, withStyles} from '@material-ui/core'

import {routeTo} from '@/helpers/routes'
import SideMenu from './SideMenu'
import StakePoolList from './StakeList'
import StakePoolHeader from './Header'
import PageNotFound from '../PageNotFound'

const styles = () =>
  createStyles({
    sidebar: {
      maxWidth: '400px',
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

export default compose(withStyles(styles))(({classes}) => (
  <Grid container direction="column" className={classes.wrapper}>
    <Grid item>
      <StakePoolHeader />
    </Grid>
    <Grid item>
      <Grid container direction="row" wrap="nowrap" spacing={24}>
        <Grid item lg={3} xl={3}>
          <div className={classes.sidebar}>
            <SideMenu />
          </div>
        </Grid>
        <Grid item lg={9} xl={6} className={classes.mainContent}>
          <Switch>
            <Redirect exact from={routeTo.staking.home()} to={routeTo.staking.poolList()} />
            <Route exact path={routeTo.staking.poolList()} component={StakePoolList} />
            <Route component={NotFound} />
          </Switch>
        </Grid>
        <Grid item lg={0} xl={3} />
      </Grid>
    </Grid>
  </Grid>
))
