// @flow

import * as React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import useReactRouter from 'use-react-router'

import * as urlUtils from '@/helpers/url'
import {routeTo} from '@/helpers/routes'
import {
  StakingContextProvider,
  useSetListScreenStorageFromQuery,
  useSetBasicScreenStorageFromQuery,
} from './context'
import {useAutoSyncContext} from './context/autoSync'
import SideMenu from './SideMenu'
import StakePoolList from './StakeList'
import ComparisonMatrix from './ComparisonMatrix'
import People from './People'
import StakePoolHeader from './Header'
import PageNotFound from '../PageNotFound'
import LocationMap from './LocationMap'

const DEFAULT_MAX_WIDTH = '1000px'

const useStyles = makeStyles((theme) => {
  // Note: we use `width` instead of `flex: 0 0 width` as it is causing spaces at the bottom of div
  const sidebarWidth = 450
  return {
    layoutWrapper: {
      display: 'flex',
      width: '100%',
    },
    sidebarWrapper: {
      width: sidebarWidth,
      paddingRight: theme.spacing.unit * 3,
    },
    fullWidthWrapper: {
      width: `calc(100% - ${sidebarWidth}px)`,
    },
    centerWrapper: {
      display: 'flex',
      flex: 1,
      justifyContent: 'flex-start',
      [theme.breakpoints.up('xl')]: {
        justifyContent: 'center',
      },
    },
    centeredItem: {
      maxWidth: ({maxWidth}) => maxWidth,
      width: '100%',
    },
    rightSideWrapper: {
      width: 0,
      [theme.breakpoints.up('xl')]: {
        width: sidebarWidth,
      },
    },
  }
})

// Note: URL vs Storage: no merging: either url or localStorage wins
const synchronizedScreenFactory = (Screen, useSetScreenStorageFromQuery) => () => {
  const {
    location: {search: urlQuery},
    match: {path},
  } = useReactRouter()
  const {setScreenStorageFromQuery, getScreenUrlQuery} = useSetScreenStorageFromQuery()
  const {autoSync, setAutosync} = useAutoSyncContext()

  const storageQuery = getScreenUrlQuery()

  React.useEffect(() => {
    if (urlQuery) {
      // Initial load case, to determine whether we should set `autosync` to true/false.
      if (autoSync === null) {
        setAutosync(urlUtils.areQueryStringsSame(urlQuery, storageQuery))
      }

      if (!urlUtils.areQueryStringsSame(urlQuery, storageQuery) && autoSync) {
        setScreenStorageFromQuery(urlQuery)
        console.log('Synchronized storage from url') // eslint-disable-line
      }
    }
    if (!urlQuery && autoSync == null) {
      setAutosync(true)
    }
  }, [urlQuery, storageQuery, setScreenStorageFromQuery, autoSync, setAutosync])

  return urlQuery || !storageQuery ? <Screen /> : <Redirect exact to={`${path}${storageQuery}`} />
}

const LayoutedStakePoolList = () => (
  <CenteredLayout>
    <StakePoolList />
  </CenteredLayout>
)
const LayoutedComparisonMatrix = () => (
  <FullWidthLayout center={false}>
    <ComparisonMatrix />
  </FullWidthLayout>
)
const LayoutedHistory = () => (
  <CenteredLayout>
    <PageNotFound />
  </CenteredLayout>
)
const LayoutedCharts = () => (
  <CenteredLayout>
    <PageNotFound />
  </CenteredLayout>
)
const LayoutedLocation = () => (
  <CenteredLayout>
    <LocationMap />
  </CenteredLayout>
)
const LayoutedPeople = () => (
  <CenteredLayout>
    <People />
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
const PeopleQuerySynchronizer = synchronizedScreenFactory(
  LayoutedPeople,
  useSetBasicScreenStorageFromQuery
)

type CenteredLayoutProps = {
  children: React.Node,
  maxWidth?: string,
}

const CenteredLayout = ({children, maxWidth = DEFAULT_MAX_WIDTH}: CenteredLayoutProps) => {
  // Note: using custom classes instead of Grid as we need to specify
  // also `flex-basis` and `flex-shrink`
  const classes = useStyles({maxWidth})
  return (
    <div className={classes.layoutWrapper}>
      <div className={classes.sidebarWrapper}>
        <SideMenu />
      </div>
      <div className={classes.centerWrapper}>
        <div className={classes.centeredItem}>{children}</div>
      </div>
      <div className={classes.rightSideWrapper} />
    </div>
  )
}

const FullWidthLayout = ({children}) => {
  // Note: using custom classes instead of Grid as we need to specify
  // also `flex-basis` and `flex-shrink`
  const classes = useStyles()
  return (
    <div className={classes.layoutWrapper}>
      <div className={classes.sidebarWrapper}>
        <SideMenu />
      </div>
      <div className={classes.fullWidthWrapper}>{children}</div>
    </div>
  )
}

export default () => {
  const {autoSync} = useAutoSyncContext()

  return (
    <StakingContextProvider autoSync={autoSync}>
      <Grid container direction="column">
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
          <Route exact path={routeTo.staking.people()} component={PeopleQuerySynchronizer} />
          <Route component={PageNotFound} />
        </Switch>
      </Grid>
    </StakingContextProvider>
  )
}
