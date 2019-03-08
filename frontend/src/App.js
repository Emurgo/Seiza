// @flow

import './initMaterialUI'
import React from 'react'
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import {withRouter} from 'react-router'
import {compose} from 'redux'
import {CssBaseline, Grid} from '@material-ui/core'
import {makeStyles, ThemeProvider} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {routeTo} from './helpers/routes'
import {provideIntl} from './components/HOC/intl'
import {provideTheme, withTheme} from './components/HOC/theme'
import {Navbar, Footer} from './components/visual'
import {useI18n, InjectHookIntlContext} from '@/i18n/helpers'

import Home from './screens/Home'
import Blockchain from './screens/Blockchain'
import Staking from './screens/Staking'
import More from './screens/More'
import PageNotFound from './screens/PageNotFound'
import LanguageSelect from '@/components/common/LanguageSelect'
import ThemeSelect from '@/components/common/ThemeSelect'

import './App.css'
import seizaLogo from './assets/icons/logo-seiza.svg'

const navigationMessages = defineMessages({
  home: 'Home',
  blockchain: 'Blockchain',
  staking: 'Staking',
  more: 'More',
})

const useAppStyles = makeStyles((theme) => ({
  maxHeight: {
    height: '100%',
  },
  contentWrapper: {
    flex: 1,
  },
  topBar: {
    padding: theme.spacing.unit,
  },
}))

const getTranslatedNavItems = (translate) => [
  {link: routeTo.home(), label: translate(navigationMessages.home)},
  {link: routeTo.blockchain(), label: translate(navigationMessages.blockchain)},
  {link: routeTo.staking.home(), label: translate(navigationMessages.staking)},
  {link: routeTo.more(), label: translate(navigationMessages.more)},
]

const TopBar = compose(withRouter)(({location: {pathname}}) => {
  const {translate} = useI18n()
  const classes = useAppStyles()
  return (
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
          <LanguageSelect />
          <ThemeSelect />
        </Grid>
      </Grid>
    </Grid>
  )
})

const App = () => {
  const classes = useAppStyles()
  const {translate} = useI18n()
  return (
    <Router>
      <Grid container direction="column" className={classes.maxHeight} wrap="nowrap">
        <Grid item>
          <CssBaseline />
          <TopBar />
        </Grid>
        <Grid item className={classes.contentWrapper}>
          <Switch>
            <Redirect exact from="/" to={routeTo.home()} />
            <Route exact path={routeTo.home()} component={Home} />
            <Route path={routeTo.blockchain()} component={Blockchain} />
            <Route path={routeTo.staking.home()} component={Staking} />
            <Route path={routeTo.more()} component={More} />
            <Route component={PageNotFound} />
          </Switch>
        </Grid>
        <Grid item>
          <Footer navItems={getTranslatedNavItems(translate)} />
        </Grid>
      </Grid>
    </Router>
  )
}

const ThemeWrapper = ({currentTheme, themeDefinitions}) => (
  <ThemeProvider theme={themeDefinitions[currentTheme]}>
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
