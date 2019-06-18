// @flow

import cn from 'classnames'
import React from 'react'
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import {compose} from 'redux'
import {CssBaseline, Grid} from '@material-ui/core'
import {makeStyles, ThemeProvider} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {routeTo} from './helpers/routes'
import {provideIntl} from './components/HOC/intl'
import {provideTheme, withTheme, THEME_DEFINITIONS} from './components/HOC/theme'
import Footer from './screens/Footer'
import {useI18n, InjectHookIntlContext} from '@/i18n/helpers'
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
import DefaultErrorBoundary from '@/components/common/DefaultErrorBoundary'
import {SubscribeProvider} from '@/components/context/SubscribeContext'
import {CookiesProvider} from '@/components/context/CookiesContext'
import {AnalyticsProvider} from '@/helpers/googleAnalytics' // TODO move to context?
import {CurrencyProvider} from '@/components/hooks/useCurrency'
import {SearchbarRefProvider} from '@/components/context/SearchbarRef'
import EnvOverrides from './screens/EnvOverrides'
import TopBar from './TopBar'
import './App.css'

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
    zIndex: 2,
    [theme.breakpoints.up('md')]: {
      position: 'static',
      zIndex: 0,
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
  <CookiesProvider>
    {/* Note: must be defined after CookiesProvider */}
    <AnalyticsProvider>
      <CurrencyProvider>
        <SubscribeProvider>
          <AutoSyncProvider>
            <SearchbarRefProvider>{children}</SearchbarRefProvider>
          </AutoSyncProvider>
        </SubscribeProvider>
      </CurrencyProvider>
    </AnalyticsProvider>
  </CookiesProvider>
)

const renderRouteDef = ({path, ...rest}) => (path ? <Route path={path} {...rest} /> : null)

const AppLayout = () => {
  const classes = useAppStyles()
  const {translate} = useI18n()

  const combinedBlockchainPath = routeTo._anyOf([routeTo.blockchain(), routeTo.home()])

  return (
    <Grid container direction="column" className={classes.mainWrapper} wrap="nowrap">
      <CookiesBanner />

      <Grid item className={cn(classes.navHeaderWrapper, 'sticky')}>
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
              {renderRouteDef({exact: true, path: routeTo.envOverrides(), component: EnvOverrides})}
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

const App = () => (
  <DefaultErrorBoundary>
    <Router>
      <Providers>
        <AppLayout />
      </Providers>
    </Router>
  </DefaultErrorBoundary>
)

const ThemeWrapper = ({currentTheme}) => (
  <ThemeProvider theme={THEME_DEFINITIONS[currentTheme]}>
    <InjectHookIntlContext>
      <App />
    </InjectHookIntlContext>
  </ThemeProvider>
)

export default compose(
  provideIntl,
  provideTheme,
  withTheme
)(ThemeWrapper)
