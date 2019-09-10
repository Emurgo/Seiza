// @flow

import React from 'react'
import dynamic from 'next/dynamic'
import {BrowserRouter, StaticRouter, Route, Switch} from 'react-router-dom'
import cn from 'classnames'
import {CssBaseline, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'
import {matchPath} from 'react-router'

import {NAV_HEADER_HEIGHT} from '@/components/hooks/useScrollFromBottom'
import {routeTo, combinedBlockchainPath} from './helpers/routes'
import Footer from './screens/Footer'
import {useI18n} from '@/i18n/helpers'
import {setupWhyDidYouRender} from '@/helpers/performance'
import {AutoSyncProvider} from './screens/Staking/context/autoSync'

import BlockchainHeader from './screens/Blockchain/BlockchainHeader'
import PageNotFound from './screens/PageNotFound'
import CookiesBanner from '@/components/common/CookiesBanner'
import UnsupportedBrowserBanner from '@/components/common/UnsupportedBrowserBanner'

import DefaultErrorBoundary from '@/components/common/DefaultErrorBoundary'
import {AcceptCookiesProvider} from '@/components/context/acceptCookies'
import {AnalyticsProvider} from '@/components/context/googleAnalytics'
import {RefProviders} from '@/components/context/refs'
import {SearchbarRefProvider} from '@/components/context/searchbarRef'
import {CurrencyProvider} from '@/components/hooks/useCurrency'
import TopBar from './TopBar'

import {useGlobalStyles} from './globalStyles'

import config from '@/config'

// Quick workaround to avoid adding 'nivo' package to main bundle as
// "More" page is by default not used
const More = dynamic(() => import('./screens/More'))
const Home = dynamic(() => import('./screens/Home'))
const Blockchain = dynamic(() => import('./screens/Blockchain'))
const StakingAdvanced = dynamic(() => import('./screens/Staking/StakingAdvanced'))
const StakingSimple = dynamic(() => import('./screens/Staking/StakingSimple'))
const StakingPools = dynamic(() => import('./screens/StakingPools'))
const Terms = dynamic(() => import('./screens/Legal/Terms'))
const Privacy = dynamic(() => import('./screens/Legal/Privacy'))
const SubscribeConfirmation = dynamic(() => import('./screens/SubscribeConfirmation'))
const EnvOverrides = dynamic(() => import('./screens/EnvOverrides'))

if (!config.isProduction && config.watchRenderPerformance) {
  setupWhyDidYouRender()
}

const navigationMessages = defineMessages({
  home: 'Home',
  blockchain: 'Blockchain',
  staking: 'Staking simulator',
  stakePools: 'Stake pools',
  more: 'More',
  termsOfUse: 'Terms of use',
  privacy: 'Privacy',
  disabledText: 'Coming soon',
  simpleStaking: 'Simple staking simulator',
  advancedStaking: 'Advanced staking simulator',
})

const useAppStyles = makeStyles((theme) => ({
  mainWrapper: {
    maxWidth: '1920px',
    margin: 'auto',
    minHeight: '100%',
  },
  contentWrapper: {
    flex: 1,
  },
  navHeaderWrapper: {
    top: 0,
    zIndex: 30,
    position: 'sticky',
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  navHeaderWrapperHeight: {
    height: NAV_HEADER_HEIGHT,
  },
}))

// Note: using `disabledText` as boolean and string at once, to have fewer config options
// and due it is mostly temporary feature
const getTranslatedNavItems = (translate) =>
  [
    {
      link: routeTo.home(),
      label: translate(navigationMessages.home),
      getIsActive: ({location, match}) => {
        return location.pathname === routeTo.home()
      },
    },
    {link: routeTo.blockchain(), label: translate(navigationMessages.blockchain)},
    {
      link: routeTo.stakingCenter.home(),
      label: translate(navigationMessages.staking),
      disabledText: translate(navigationMessages.disabledText),
      getIsActive: ({location, match}) => {
        return !!match || matchPath(location.pathname, routeTo.stakingCenterSimple())
      },
      sublinks: [
        {
          link: routeTo.stakingCenterSimple(),
          label: translate(navigationMessages.simpleStaking),
          disabledText: translate(navigationMessages.disabledText),
        },
        {
          link: routeTo.stakingCenter.home(),
          label: translate(navigationMessages.advancedStaking),
          disabledText: translate(navigationMessages.disabledText),
        },
      ],
    },
    {
      link: routeTo.stakingPoolsList(),
      label: translate(navigationMessages.stakePools),
      disabledText: translate(navigationMessages.disabledText),
    },
    {
      link: routeTo.more(),
      label: translate(navigationMessages.more),
    },
    // $FlowFixMe
  ].filter((item) => item.link || item.disabledText)

const getTranslatedFooterNavItems = (translate) => {
  const mainNavItems = getTranslatedNavItems(translate)
  return [
    ...mainNavItems,
    {link: routeTo.termsOfUse(), label: translate(navigationMessages.termsOfUse)},
    {link: routeTo.privacy(), label: translate(navigationMessages.privacy)},
    // $FlowFixMe
  ].filter((item) => item.link || item.disabledText)
}

const Providers = ({children}) => (
  <AcceptCookiesProvider>
    {/* Note: must be defined after AcceptCookiesProvider */}
    <AnalyticsProvider>
      <CurrencyProvider>
        <AutoSyncProvider>
          <RefProviders>
            <SearchbarRefProvider>{children}</SearchbarRefProvider>
          </RefProviders>
        </AutoSyncProvider>
      </CurrencyProvider>
    </AnalyticsProvider>
  </AcceptCookiesProvider>
)

const renderRouteDef = ({path, ...rest}) => (path ? <Route path={path} {...rest} /> : null)

const AppLayout = () => {
  useGlobalStyles()
  const classes = useAppStyles()
  const {translate} = useI18n()

  return (
    <Grid container direction="column" className={classes.mainWrapper} wrap="nowrap">
      <UnsupportedBrowserBanner />
      <CookiesBanner />

      <Grid
        item
        className={cn(classes.navHeaderWrapper, !config.isYoroi && classes.navHeaderWrapperHeight)}
      >
        <CssBaseline />
        {!config.isYoroi && <TopBar navItems={getTranslatedNavItems(translate)} />}
      </Grid>
      <DefaultErrorBoundary>
        <React.Fragment>
          <Grid item className={classes.contentWrapper}>
            <Switch>
              {combinedBlockchainPath && (
                <Route path={combinedBlockchainPath}>
                  <BlockchainHeader />
                  {routeTo.home() && <Route exact path={routeTo.home()} component={Home} />}
                  {routeTo.blockchain() && (
                    <Route path={routeTo.blockchain()} component={Blockchain} />
                  )}
                </Route>
              )}
              {renderRouteDef({
                path: routeTo.stakingCenter.home(),
                component: StakingAdvanced,
              })}
              {renderRouteDef({
                path: routeTo.stakingCenterSimple(),
                component: StakingSimple,
              })}
              {renderRouteDef({path: routeTo.stakingPoolsList(), component: StakingPools})}
              {renderRouteDef({exact: true, path: routeTo.more(), component: More})}
              {renderRouteDef({exact: true, path: routeTo.termsOfUse(), component: Terms})}
              {renderRouteDef({exact: true, path: routeTo.privacy(), component: Privacy})}
              {renderRouteDef({
                exact: true,
                path: routeTo.subscribeConfirmation(),
                component: SubscribeConfirmation,
              })}
              {renderRouteDef({
                exact: true,
                path: routeTo.envOverrides(),
                component: EnvOverrides,
              })}
              <Route component={PageNotFound} />
            </Switch>
          </Grid>
          {!config.isYoroi && (
            <Grid item>
              <Footer navItems={getTranslatedFooterNavItems(translate)} />
            </Grid>
          )}
        </React.Fragment>
      </DefaultErrorBoundary>
    </Grid>
  )
}

const _Router = process.browser
  ? ({children}) => <BrowserRouter>{children}</BrowserRouter>
  : ({children, context}) => (
    <StaticRouter location={context.location} context={context}>
      {children}
    </StaticRouter>
  )

const App = ({routerCtx}: {routerCtx: any}) => (
  <DefaultErrorBoundary>
    <_Router context={routerCtx}>
      <Providers>
        <AppLayout />
      </Providers>
    </_Router>
  </DefaultErrorBoundary>
)

export default App
