// @flow

import './initMaterialUI'
import cn from 'classnames'
import React from 'react'
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import {withRouter} from 'react-router'
import {compose} from 'redux'
import {CssBaseline, Grid, Hidden} from '@material-ui/core'
import {makeStyles, ThemeProvider} from '@material-ui/styles'
import {defineMessages} from 'react-intl'
import {fade} from '@material-ui/core/styles/colorManipulator'

import config from './config'
import {routeTo} from './helpers/routes'
import {provideIntl} from './components/HOC/intl'
import {provideTheme, withTheme, THEME_DEFINITIONS} from './components/HOC/theme'
import {Navbar, MobileNavbar, Link} from './components/visual'
import Footer from './screens/Footer'
import {useI18n, InjectHookIntlContext} from '@/i18n/helpers'
import {AutoSyncProvider} from './screens/Staking/context/autoSync'

import Terms from './screens/Legal/Terms'
import Privacy from './screens/Legal/Privacy'
import Home from './screens/Home'
import Blockchain from './screens/Blockchain'
import BlockchainHeader from './screens/Blockchain/BlockchainHeader'
import Staking from './screens/Staking'
import More from './screens/More'
import PageNotFound from './screens/PageNotFound'
import LanguageSelect from '@/components/common/LanguageSelect'
import ThemeSelect from '@/components/common/ThemeSelect'
import CookiesBanner from '@/components/common/CookiesBanner'
import DefaultErrorBoundary from '@/components/common/DefaultErrorBoundary'
import {SubscribeProvider} from '@/components/context/SubscribeContext'
import {CookiesProvider} from '@/components/context/CookiesContext'
import {AnalyticsProvider} from '@/helpers/googleAnalytics' // TODO move to context?
import {CurrencyProvider} from '@/components/hooks/useCurrency'
import {SearchbarRefProvider} from '@/components/context/SearchbarRef'
import Search from './screens/Blockchain/BlockchainHeader/Search'
import EnvOverrides from './screens/EnvOverrides'

import './App.css'
import seizaLogo from './assets/icons/logo-seiza.svg'

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
  topBar: {
    position: 'relative',
    background: theme.palette.background.paper,
    boxShadow: `0px 5px 25px ${fade(theme.palette.shadowBase, 0.12)}`,
    padding: theme.spacing.unit,
    [theme.breakpoints.up('sm')]: {
      padding: `${theme.spacing.unit}px ${theme.spacing.unit * 5}px`,
    },
  },
  mobileSearch: {
    flex: 1,
    marginLeft: 0,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 2,
    },
  },
  navHeaderWrapper: {
    top: 0,
    zIndex: 1,
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
      link: routeTo.staking.home(),
      label: translate(navigationMessages.staking),
      disabledText: translate(navigationMessages.disabledText),
    },
    {
      link: routeTo.staking.home(), // Note: not yet implemented screen
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

const TopBar = compose(withRouter)(({location: {pathname}}) => {
  const {translate} = useI18n()
  const classes = useAppStyles()
  return (
    <React.Fragment>
      <Hidden smDown>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          className={classes.topBar}
        >
          <Grid item>
            <Link to={routeTo.home()}>
              <img alt="" src={seizaLogo} />
            </Link>
          </Grid>
          <Grid item>
            <Grid container direction="row" alignItems="center">
              <Navbar currentPathname={pathname} items={getTranslatedNavItems(translate)} />
              <LanguageSelect />
              {config.featureEnableThemes && <ThemeSelect />}
            </Grid>
          </Grid>
        </Grid>
      </Hidden>
      <Hidden mdUp>
        <div className={cn(classes.topBar, 'd-flex')}>
          <MobileNavbar currentPathname={pathname} items={getTranslatedNavItems(translate)} />
          <div className={classes.mobileSearch}>
            <Search isMobile />
          </div>
        </div>
      </Hidden>
    </React.Fragment>
  )
})

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
        <TopBar />
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
              {renderRouteDef({path: routeTo.staking.home(), component: Staking})}
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
