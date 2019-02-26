import React from 'react'
import {Switch, Route} from 'react-router-dom'
import {compose} from 'redux'
import {Grid, createStyles, withStyles} from '@material-ui/core'

import {routeTo} from '@/helpers/routes'
import SideMenu from './SideMenu'
import StakePoolList from './StakeList'
import StakePoolHeader from './Header'
import PageNotFound from '../PageNotFound'

const layoutStyles = () =>
  createStyles({
    sidebar: {
      width: '400px',
    },
    content: {
      flex: 1,
    },
  })

export default compose(withStyles(layoutStyles))(({classes}) => (
  <Grid container direction="column">
    <StakePoolHeader />
    <Grid container direction="row">
      <Grid item className={classes.sidebar}>
        <SideMenu />
      </Grid>
      <Grid item className={classes.content}>
        <Switch>
          <Route exact path={routeTo.staking()} component={StakePoolList} />
          <Route component={PageNotFound} />
        </Switch>
      </Grid>
    </Grid>
  </Grid>
))
