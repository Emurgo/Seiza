// @flow

import React, {useEffect} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {Grid, createStyles} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import useReactRouter from 'use-react-router'

import * as urlUtils from '@/helpers/url'
import {routeTo} from '@/helpers/routes'
import {
  StakingContextProvider,
  useSetListScreenStorageFromQuery,
  useSetBasicScreenStorageFromQuery,
} from './context'
import SideMenu from './SideMenu'
import StakePoolList from './StakeList'
import StakePoolHeader from './Header'
import PageNotFound from '../PageNotFound'

const useStyles = makeStyles((theme) =>
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
)

const NotFound = () => {
  const classes = useStyles()
  return (
    <div className={classes.notFound}>
      <PageNotFound />
    </div>
  )
}

const urlToScreen = {
  [routeTo.staking.poolList()]: StakePoolList,
  [routeTo.staking.poolComparison()]: PageNotFound,
  [routeTo.staking.history()]: PageNotFound,
  [routeTo.staking.charts()]: PageNotFound,
  [routeTo.staking.location()]: PageNotFound,
}

// Note: URL vs Storage: no merging: either url or localStorage wins
const getQuerySynchronizer = (useSetScreenStorageFromQuery) => () => {
  const {
    location: {search: urlQuery},
    match,
  } = useReactRouter()
  const pathname = match.path
  const {setScreenStorageFromQuery, getScreenUrlQuery} = useSetScreenStorageFromQuery()

  const storageQuery = getScreenUrlQuery()

  useEffect(() => {
    if (urlQuery && !urlUtils.areQueryStringsSame(urlQuery, storageQuery)) {
      setScreenStorageFromQuery(urlQuery)
    }
  }, [urlQuery, storageQuery])

  const Screen = urlToScreen[match.path]

  return urlQuery || !storageQuery ? (
    <Screen />
  ) : (
    <Redirect exact to={`${pathname}${storageQuery}`} />
  )
}

const PoolListQuerySynchronizer = getQuerySynchronizer(useSetListScreenStorageFromQuery)
const PoolComparisonQuerySynchronizer = getQuerySynchronizer(useSetBasicScreenStorageFromQuery)
const HistoryQuerySynchronizer = getQuerySynchronizer(useSetBasicScreenStorageFromQuery)
const ChartsQuerySynchronizer = getQuerySynchronizer(useSetBasicScreenStorageFromQuery)
const LocationQuerySynchronizer = getQuerySynchronizer(useSetBasicScreenStorageFromQuery)

export default () => {
  const classes = useStyles()
  return (
    <StakingContextProvider>
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
              <Route
                exact
                path={routeTo.staking.poolList()}
                component={PoolListQuerySynchronizer}
              />
              <Route
                exact
                path={routeTo.staking.poolComparison()}
                component={PoolComparisonQuerySynchronizer}
              />
              <Route exact path={routeTo.staking.history()} component={HistoryQuerySynchronizer} />
              <Route exact path={routeTo.staking.charts()} component={ChartsQuerySynchronizer} />
              <Route
                exact
                path={routeTo.staking.location()}
                component={LocationQuerySynchronizer}
              />
              <Route component={NotFound} />
            </Switch>
          </Grid>
          <Grid item lg={false} xl={3} />
        </Grid>
      </Grid>
    </StakingContextProvider>
  )
}
