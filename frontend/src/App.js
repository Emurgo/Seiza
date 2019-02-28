// @flow

import React from 'react'
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import {withRouter} from 'react-router'
import {compose} from 'redux'
import {CssBaseline, Grid, withStyles, createStyles} from '@material-ui/core'
import {MuiThemeProvider} from '@material-ui/core/styles'

import {routeTo} from './helpers/routes'
import {provideIntl} from './components/HOC/intl'
import {provideTheme, withTheme} from './components/HOC/theme'
import {Navbar, Footer} from './components/visual'

import Home from './screens/Home'
import Blockchain from './screens/Blockchain'
import Staking from './screens/Staking'
import More from './screens/More'
import PageNotFound from './screens/PageNotFound'
import LanguageSelect from '@/components/common/LanguageSelect'
import ThemeSelect from '@/components/common/ThemeSelect'

import './App.css'
import seizaLogo from './seiza-logo.png'

// TODO: error handling

// TODO: intl
const navItems = [
  {link: routeTo.home(), label: 'Home'},
  {link: routeTo.blockchain(), label: 'Blockchain'},
  {link: routeTo.staking.home(), label: 'Staking'},
  {link: routeTo.more(), label: 'More'},
]

const TopBar = withRouter(({location: {pathname}}) => {
  return (
    <Grid container direction="row" justify="space-between" alignItems="center">
      <Grid item>
        <img alt="" src={seizaLogo} />
      </Grid>
      <Grid item>
        <Grid container direction="row" alignItems="center">
          <Navbar currentPathname={pathname} items={navItems} />
          <LanguageSelect />
          <ThemeSelect />
        </Grid>
      </Grid>
    </Grid>
  )
})

const styles = createStyles({
  maxHeight: {
    height: '100%',
  },
  contentWrapper: {
    flex: 1,
  },
})

const App = compose(withStyles(styles))(({classes}) => (
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
        <Footer navItems={navItems} />
      </Grid>
    </Grid>
  </Router>
))

const ThemeWrapper = ({classes, currentTheme, themeDefinitions}) => (
  <MuiThemeProvider className={classes.maxHeight} theme={themeDefinitions[currentTheme]}>
    <App />
  </MuiThemeProvider>
)

export default compose(
  provideIntl,
  provideTheme,
  withTheme,
  withStyles(styles)
)(ThemeWrapper)
