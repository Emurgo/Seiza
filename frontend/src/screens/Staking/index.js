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
import StakePoolListScreen from './StakeList'
import ComparisonMatrixScreen from './ComparisonMatrix'
import PeopleScreen from './People'
import StakePoolHeader from './Header'
import PageNotFound from '../PageNotFound'
import LocationMapScreen from './LocationMap'
import HistoryScreen from './History'
import ChartsScreen from './Charts'

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
    <StakePoolListScreen />
  </CenteredLayout>
)
const LayoutedComparisonMatrix = () => (
  <FullWidthLayout center={false}>
    <ComparisonMatrixScreen />
  </FullWidthLayout>
)
const LayoutedHistory = () => (
  <CenteredLayout>
    <HistoryScreen />
  </CenteredLayout>
)
const LayoutedCharts = () => (
  <CenteredLayout>
    <ChartsScreen />
  </CenteredLayout>
)
const LayoutedLocation = () => (
  <CenteredLayout>
    <LocationMapScreen />
  </CenteredLayout>
)
const LayoutedPeople = () => (
  <CenteredLayout>
    <PeopleScreen />
  </CenteredLayout>
)

const StakingPageNotFound = () => (
  <CenteredLayout>
    <PageNotFound />
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

// Note: This cannot be a component because Switch doesn't like non-route components as children
// and behaves unexpectedly in such cases
const renderRouteDef = (path, component) =>
  path ? <Route exact path={path} component={component} /> : null

export default () => {
  const {autoSync} = useAutoSyncContext()
  const stakingRoutes = routeTo.staking
  return (
    <StakingContextProvider autoSync={autoSync}>
      <Grid container direction="column">
        <StakePoolHeader />

        <Switch>
          {/* Default redirect */}
          {stakingRoutes.poolList() && (
            <Redirect exact from={stakingRoutes.home()} to={stakingRoutes.poolList()} />
          )}

          {/* Routes */}
          {renderRouteDef(stakingRoutes.poolList(), PoolListQuerySynchronizer)}
          {renderRouteDef(stakingRoutes.poolComparison(), PoolComparisonQuerySynchronizer)}
          {renderRouteDef(stakingRoutes.history(), HistoryQuerySynchronizer)}
          {renderRouteDef(stakingRoutes.charts(), ChartsQuerySynchronizer)}
          {renderRouteDef(stakingRoutes.location(), LocationQuerySynchronizer)}
          {renderRouteDef(stakingRoutes.people(), PeopleQuerySynchronizer)}

          {/* Fallback */}
          <Route component={StakingPageNotFound} />
        </Switch>
      </Grid>
    </StakingContextProvider>
  )
}
