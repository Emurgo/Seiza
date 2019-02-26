// @flow

import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
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
  {link: routeTo.staking(), label: 'Staking'},
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

const mainLayoutStyles = ({palette}) =>
  createStyles({
    maxHeight: {
      height: '100%',
    },
    pageWrapper: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    contentWrapper: {
      flex: 1,
    },
    noShrinkWrapper: {
      flexShrink: 0,
    },
  })

const themeProviderStyles = createStyles({
  maxHeight: {
    height: '100%',
  },
})

const App = compose(withStyles(mainLayoutStyles))(({classes}) => (
  <Router>
    <div className={classes.pageWrapper}>
      <div className={classes.noShrinkWrapper}>
        <CssBaseline />
        <TopBar />
      </div>
      <div className={classes.contentWrapper}>
        {/* Note: when the screens are not wrapped inside 'Grid' there are
                strange overflow issues.
                Note: Custom flex layout is used to make screen view span all width expect
                topBar and footer (when using Grid for it, it behaves strange when shrinked).
            */}
        <Grid container direction="column" className={classes.maxHeight}>
          <Grid item className={classes.maxHeight}>
            <Switch>
              <Route exact path={routeTo.home()} component={Home} />
              <Route path={routeTo.blockchain()} component={Blockchain} />
              <Route path={routeTo.staking()} component={Staking} />
              <Route path={routeTo.more()} component={More} />
              <Route component={PageNotFound} />
            </Switch>
          </Grid>
        </Grid>
      </div>
      <div className={classes.noShrinkWrapper}>
        <Footer navItems={navItems} />
      </div>
    </div>
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
  withStyles(themeProviderStyles)
)(ThemeWrapper)
