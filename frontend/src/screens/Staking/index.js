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

const SIDEBAR_WIDTH = 400

const styles = () =>
  createStyles({
    sidebar: {
      width: `${SIDEBAR_WIDTH}px`,
    },
    content: {
      flex: 1,
      paddingRight: `${SIDEBAR_WIDTH}px`,
    },
    notFound: {
      marginTop: '100px',
    },
  })

const NotFound = withStyles(styles)(({classes}) => (
  <div className={classes.notFound}>
    <PageNotFound />
  </div>
))

export default compose(withStyles(styles))(({classes}) => (
  <Grid container direction="column">
    <StakePoolHeader />
    <Grid container direction="row">
      <Grid item className={classes.sidebar}>
        <SideMenu />
      </Grid>
      <Grid item className={classes.content}>
        <Switch>
          <Redirect exact from={routeTo.staking.home()} to={routeTo.staking.poolList()} />
          <Route exact path={routeTo.staking.poolList()} component={StakePoolList} />
          <Route component={NotFound} />
        </Switch>
      </Grid>
    </Grid>
  </Grid>
))
