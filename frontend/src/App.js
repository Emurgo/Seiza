// @flow

import React from 'react'
import {BrowserRouter, StaticRouter, Route, Switch, Redirect} from 'react-router-dom'
import {CssBaseline, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {routeTo, combinedBlockchainPath} from './helpers/routes'
import Footer from './screens/Footer'
import {useI18n} from '@/i18n/helpers'
import {setupWhyDidYouRender} from '@/helpers/performance'
import {AutoSyncProvider} from './screens/Staking/context/autoSync'

import Terms from './screens/Legal/Terms'
import Privacy from './screens/Legal/Privacy'
import Home from './screens/Home'
import Blockchain from './screens/Blockchain'
import BlockchainHeader from './screens/Blockchain/BlockchainHeader'
import Staking from './screens/Staking'
import StakingPools from './screens/StakingPools'
import More from './screens/More'
import PageNotFound from './screens/PageNotFound'
import CookiesBanner from '@/components/common/CookiesBanner'
import UnsupportedBrowserBanner from '@/components/common/UnsupportedBrowserBanner'

import DefaultErrorBoundary from '@/components/common/DefaultErrorBoundary'
import {AcceptCookiesProvider} from '@/components/context/acceptCookies'
import {AnalyticsProvider} from '@/components/context/googleAnalytics'
import {RefProviders} from '@/components/context/refs'
import {SearchbarRefProvider} from '@/screens/Blockchain/context/searchbarRef'
import {CurrencyProvider} from '@/components/hooks/useCurrency'
import EnvOverrides from './screens/EnvOverrides'
import TopBar from './TopBar'

import config from '@/config'

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
}))

// Note: using `disabledText` as boolean and string at once, to have fewer config options
// and due it is mostly temporary feature
const getTranslatedNavItems = (translate) =>
  [
    {link: routeTo.home(), label: translate(navigationMessages.home)},
    {link: routeTo.blockchain(), label: translate(navigationMessages.blockchain)},
    {
      link: routeTo.stakingCenter.home(),
      label: translate(navigationMessages.staking),
      disabledText: translate(navigationMessages.disabledText),
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
  const classes = useAppStyles()
  const {translate} = useI18n()

  return (
    <Grid container direction="column" className={classes.mainWrapper} wrap="nowrap">
      <UnsupportedBrowserBanner />
      <CookiesBanner />

      <Grid item className={classes.navHeaderWrapper}>
        <CssBaseline />
        <TopBar navItems={getTranslatedNavItems(translate)} />
      </Grid>
      <DefaultErrorBoundary>
        <React.Fragment>
          <Grid item className={classes.contentWrapper}>
            <Switch>
              <Redirect exact from="/" to={routeTo.home()} />

              {combinedBlockchainPath && (
                <Route path={combinedBlockchainPath}>
                  <BlockchainHeader />
                  {routeTo.home() && <Route exact path={routeTo.home()} component={Home} />}
                  {routeTo.blockchain() && (
                    <Route path={routeTo.blockchain()} component={Blockchain} />
                  )}
                </Route>
              )}
              {renderRouteDef({path: routeTo.stakingCenter.home(), component: Staking})}
              {renderRouteDef({path: routeTo.stakingPoolsList(), component: StakingPools})}
              {renderRouteDef({exact: true, path: routeTo.more(), component: More})}
              {renderRouteDef({exact: true, path: routeTo.termsOfUse(), component: Terms})}
              {renderRouteDef({exact: true, path: routeTo.privacy(), component: Privacy})}
              {renderRouteDef({
                exact: true,
                path: routeTo.envOverrides(),
                component: EnvOverrides,
              })}
              <Route component={PageNotFound} />
            </Switch>
          </Grid>
          <Grid item>
            <Footer navItems={getTranslatedFooterNavItems(translate)} />
          </Grid>
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
