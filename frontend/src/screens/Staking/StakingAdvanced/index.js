// @flow

import * as React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import useReactRouter from 'use-react-router'

import * as urlUtils from '@/helpers/url'
import {routeTo} from '@/helpers/routes'
import {MobileOnly, DesktopOnly} from '@/components/visual'
import {
  StakingContextProvider,
  useSetListScreenStorageFromQuery,
  useSetBasicScreenStorageFromQuery,
} from '../context'
import {useAutoSyncContext} from '../context/autoSync'
import SideMenu from '../SideMenu'
import {StakeListLayout} from '../StakeList'
import {SearchAndFilterBar} from '../StakeList/SearchAndFilterBar'
import StakepoolCard from './StakepoolCard'
import ComparisonMatrixScreen from '../ComparisonMatrix'
import PeopleScreen from '../People'
import StakePoolHeader from './Header'
import PageNotFound from '@/screens/PageNotFound'
import LocationMapScreen from '../LocationMap'
import HistoryScreen from '../History'
import ChartsScreen from '../Charts'
import {CARD_WIDTH} from '../StakeList/stakepoolCardUtils'
import {EstimatedRewardsModeProvider} from '../StakeList/estimatedRewardsModeUtils'

const DEFAULT_MAX_WIDTH = CARD_WIDTH

const useStyles = makeStyles((theme) => {
  // Note: we use `width` instead of `flex: 0 0 width` as it is causing spaces at the bottom of div
  const sidebarWidth = 450
  return {
    mainWrapper: {
      maxWidth: '100%',
      // Note: dont set other 'overflow' than 'visible', will disable sticky navigation
    },
    layoutWrapper: {
      display: 'flex',
      width: '100%',
    },
    sidebarWrapper: {
      width: sidebarWidth,
      paddingRight: theme.spacing(3),
    },
    fullWidthWrapper: {
      width: `calc(100% - ${sidebarWidth}px)`,
    },
    centerWrapper: {
      display: 'flex',
      flex: 1,
      justifyContent: 'flex-start',
      minWidth: 0, // needed for proper ellipsize in children components with flex
      [theme.breakpoints.up('xl')]: {
        justifyContent: 'center',
      },
    },
    centeredItem: {
      maxWidth: ({maxWidth}) => maxWidth,
      width: '100%',
      padding: `${theme.spacing(6)}px ${theme.spacing(2)}px`,
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

  // Note: we currently use localStorage and sessionStorage which is not available on server
  if (!process.browser) return <Screen />

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

type CenteredLayoutProps = {
  children: React.Node,
  maxWidth?: string,
}

const MobileLayout = ({children}) => (
  <Grid item xs={12}>
    {children}
  </Grid>
)

const CenteredLayout = ({children, maxWidth = DEFAULT_MAX_WIDTH}: CenteredLayoutProps) => {
  // Note: using custom classes instead of Grid as we need to specify
  // also `flex-basis` and `flex-shrink`
  const classes = useStyles({maxWidth})

  return (
    <React.Fragment>
      <MobileOnly>
        <MobileLayout>{children}</MobileLayout>
      </MobileOnly>

      <DesktopOnly>
        <div className={classes.layoutWrapper}>
          <div className={classes.sidebarWrapper}>
            <SideMenu />
          </div>
          <div className={classes.centerWrapper}>
            <div className={classes.centeredItem}>{children}</div>
          </div>
          <div className={classes.rightSideWrapper} />
        </div>
      </DesktopOnly>
    </React.Fragment>
  )
}

const FullWidthLayout = ({children}) => {
  // Note: using custom classes instead of Grid as we need to specify
  // also `flex-basis` and `flex-shrink`
  const classes = useStyles()

  return (
    <React.Fragment>
      <MobileOnly>
        <MobileLayout>{children}</MobileLayout>
      </MobileOnly>

      <DesktopOnly>
        <div className={classes.layoutWrapper}>
          <div className={classes.sidebarWrapper}>
            <SideMenu />
          </div>
          <div className={classes.fullWidthWrapper}>{children}</div>
        </div>
      </DesktopOnly>
    </React.Fragment>
  )
}

const LayoutedStakePoolList = () => (
  <CenteredLayout>
    <StakeListLayout StakepoolCard={StakepoolCard} TopBar={SearchAndFilterBar} />
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

// Note: This cannot be a component because Switch doesn't like non-route components as children
// and behaves unexpectedly in such cases
const renderRouteDef = (path, component) =>
  path ? <Route exact path={path} component={component} /> : null

export default () => {
  const {autoSync} = useAutoSyncContext()
  const classes = useStyles()
  const stakingRoutes = routeTo.stakingCenter
  return (
    <StakingContextProvider autoSync={autoSync}>
      <EstimatedRewardsModeProvider>
        <Grid container direction="column">
          <DesktopOnly>
            <StakePoolHeader />
          </DesktopOnly>
          <MobileOnly>
            <SideMenu />
          </MobileOnly>

          <div className={classes.mainWrapper}>
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
          </div>
        </Grid>
      </EstimatedRewardsModeProvider>
    </StakingContextProvider>
  )
}
