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
import ComparisonMatrix from './ComparisonMatrix'
import StakePoolHeader from './Header'
import PageNotFound from '../PageNotFound'
import LocationMap from './LocationMap'

const SIDEBAR_WIDTH = 450

const useStyles = makeStyles((theme) =>
  createStyles({
    sidebar: {
      maxWidth: SIDEBAR_WIDTH,
    },
    notFound: {
      marginTop: '100px',
    },
    wrapper: {
      // TODO: consider a better solution to avoid scroll bars
      overflow: 'hidden',
    },
    mainContent: {
      flexGrow: 1,
    },
    mainFullWidthContent: {
      // Note: this does not work good with `flexGrow:1` as it introduces various overflow issues
      // with ComparisonMatrix layout
      width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
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

// Note: URL vs Storage: no merging: either url or localStorage wins
const synchronizedScreenFactory = (Screen, useSetScreenStorageFromQuery) => () => {
  const {
    location: {search: urlQuery},
    match: {path},
  } = useReactRouter()
  const {setScreenStorageFromQuery, getScreenUrlQuery} = useSetScreenStorageFromQuery()

  const storageQuery = getScreenUrlQuery()

  useEffect(() => {
    if (urlQuery && !urlUtils.areQueryStringsSame(urlQuery, storageQuery)) {
      setScreenStorageFromQuery(urlQuery)
    }
  }, [urlQuery, storageQuery, setScreenStorageFromQuery])

  return urlQuery || !storageQuery ? <Screen /> : <Redirect exact to={`${path}${storageQuery}`} />
}

const LayoutedStakePoolList = () => (
  <CenteredLayout>
    <StakePoolList />
  </CenteredLayout>
)
const LayoutedComparisonMatrix = () => (
  <FullWidthLayout>
    <ComparisonMatrix />
  </FullWidthLayout>
)
const LayoutedHistory = () => (
  <CenteredLayout>
    <NotFound />
  </CenteredLayout>
)
const LayoutedCharts = () => (
  <CenteredLayout>
    <NotFound />
  </CenteredLayout>
)
const LayoutedLocation = () => (
  <CenteredLayout>
    <LocationMap />
  </CenteredLayout>
)

const PoolListQuerySynchronizer = synchronizedScreenFactory(
  LayoutedStakePoolList,
  useSetListScreenStorageFromQuery
)
const PoolComparisonQuerySynchronizer = synchronizedScreenFactory(
  LayoutedComparisonMatrix,
  useSetBasicScreenStorageFromQuery
)
const HistoryQuerySynchronizer = synchronizedScreenFactory(
  LayoutedHistory,
  useSetBasicScreenStorageFromQuery
)
const ChartsQuerySynchronizer = synchronizedScreenFactory(
  LayoutedCharts,
  useSetBasicScreenStorageFromQuery
)
const LocationQuerySynchronizer = synchronizedScreenFactory(
  LayoutedLocation,
  useSetBasicScreenStorageFromQuery
)

const FullWidthLayout = ({children}) => {
  const classes = useStyles()
  return (
    <Grid container direction="row" wrap="nowrap">
      {/* Grid items were removed becaues they introduce padding which
          has alignenment issues with centered layout */}
      <div className={classes.sidebar}>
        <SideMenu />
      </div>
      <div className={classes.mainFullWidthContent}>{children}</div>
    </Grid>
  )
}

const CenteredLayout = ({children}) => {
  const classes = useStyles()
  return (
    <Grid container direction="row" wrap="nowrap" spacing={24}>
      <Grid item lg={3} xl={3}>
        <div className={classes.sidebar}>
          <SideMenu />
        </div>
      </Grid>
      <Grid item lg={9} xl={6} className={classes.mainContent}>
        {children}
      </Grid>
      <Grid item lg={false} xl={3} />
    </Grid>
  )
}

export default () => {
  const classes = useStyles()
  return (
    <StakingContextProvider>
      <Grid container direction="column" className={classes.wrapper}>
        <StakePoolHeader />

        <Switch>
          <Redirect exact from={routeTo.staking.home()} to={routeTo.staking.poolList()} />
          <Route exact path={routeTo.staking.poolList()} component={PoolListQuerySynchronizer} />
          <Route
            exact
            path={routeTo.staking.poolComparison()}
            component={PoolComparisonQuerySynchronizer}
          />
          <Route exact path={routeTo.staking.history()} component={HistoryQuerySynchronizer} />
          <Route exact path={routeTo.staking.charts()} component={ChartsQuerySynchronizer} />
          <Route exact path={routeTo.staking.location()} component={LocationQuerySynchronizer} />
          <Route component={NotFound} />
        </Switch>
      </Grid>
    </StakingContextProvider>
  )
}
