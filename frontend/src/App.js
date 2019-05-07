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
import {Navbar, MobileNavbar, Footer} from './components/visual'
import {useI18n, InjectHookIntlContext} from '@/i18n/helpers'
import {AutoSyncProvider} from './screens/Staking/context/autoSync'

import Terms from './screens/Terms'
import Home from './screens/Home'
import Blockchain from './screens/Blockchain'
import Staking from './screens/Staking'
import More from './screens/More'
import PageNotFound from './screens/PageNotFound'
import LanguageSelect from '@/components/common/LanguageSelect'
import ThemeSelect from '@/components/common/ThemeSelect'
import DefaultErrorBoundary from '@/components/common/DefaultErrorBoundary'
import {SubscribeProvider} from '@/components/context/SubscribeContext'
import {CurrencyProvider} from '@/components/hooks/useCurrency'
import Search from './screens/Blockchain/BlockchainHeader/Search'

import './App.css'
import seizaLogo from './assets/icons/logo-seiza.svg'

const navigationMessages = defineMessages({
  home: 'Home',
  blockchain: 'Blockchain',
  staking: 'Staking simulator',
  stakePools: 'Stake pools',
  more: 'More',
  termsOfUse: 'Terms of use',
  disabledText: 'Coming soon',
})

const useAppStyles = makeStyles((theme) => ({
  mainWrapper: {
    maxWidth: '1920px',
    margin: 'auto',
    height: '100%',
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
}))

// Note: using `disabledText` as boolean and string at once, to have fewer config options
// and due it is mostly temporary feature
const getTranslatedNavItems = (translate) =>
  [
    {link: routeTo.home(), label: translate(navigationMessages.home), __hide: false},
    {link: routeTo.blockchain(), label: translate(navigationMessages.blockchain), __hide: false},
    {
      link: routeTo.staking.home(),
      label: translate(navigationMessages.staking),
      disabledText: !config.showStakingData ? translate(navigationMessages.disabledText) : null,
      __hide: false,
    },
    {
      link: routeTo.staking.home(), // Note: not yet implemented screen
      label: translate(navigationMessages.stakePools),
      disabledText: !config.showStakingData ? translate(navigationMessages.disabledText) : null,
      __hide: false,
    },
    {
      link: routeTo.more(),
      label: translate(navigationMessages.more),
      __hide: !config.showStakingData,
    },
  ].filter((item) => !item.__hide)

const getTranslatedFooterNavItems = (translate) => {
  const mainNavItems = getTranslatedNavItems(translate)
  return [
    ...mainNavItems,
    {link: routeTo.termsOfUse(), label: translate(navigationMessages.termsOfUse), __hide: false},
  ]
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
            <img alt="" src={seizaLogo} />
          </Grid>
          <Grid item>
            <Grid container direction="row" alignItems="center">
              <Navbar currentPathname={pathname} items={getTranslatedNavItems(translate)} />
              {config.showStakingData && <LanguageSelect />}
              {config.showStakingData && <ThemeSelect />}
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
          {config.showStakingData && <LanguageSelect />}
          {config.showStakingData && <ThemeSelect />}
        </div>
      </Hidden>
    </React.Fragment>
  )
})

const App = () => {
  const classes = useAppStyles()
  const {translate} = useI18n()

  return (
    <DefaultErrorBoundary>
      <Router>
        <CurrencyProvider>
          <SubscribeProvider>
            <AutoSyncProvider>
              <Grid container direction="column" className={classes.mainWrapper} wrap="nowrap">
                <Grid item>
                  <CssBaseline />
                  <TopBar />
                </Grid>
                <DefaultErrorBoundary>
                  <React.Fragment>
                    <Grid item className={classes.contentWrapper}>
                      <Switch>
                        <Redirect exact from="/" to={routeTo.home()} />
                        <Route exact path={routeTo.home()} component={Home} />
                        <Route path={routeTo.blockchain()} component={Blockchain} />
                        {config.showStakingData && (
                          <Route path={routeTo.staking.home()} component={Staking} />
                        )}
                        {config.showStakingData && <Route path={routeTo.more()} component={More} />}
                        <Route exact path={routeTo.termsOfUse()} component={Terms} />
                        <Route component={PageNotFound} />
                      </Switch>
                    </Grid>
                    <Grid item>
                      <Footer navItems={getTranslatedFooterNavItems(translate)} />
                    </Grid>
                  </React.Fragment>
                </DefaultErrorBoundary>
              </Grid>
            </AutoSyncProvider>
          </SubscribeProvider>
        </CurrencyProvider>
      </Router>
    </DefaultErrorBoundary>
  )
}

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
