// @flow

import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {withRouter} from 'react-router'
import {compose} from 'redux'
import {CssBaseline, Grid, withStyles} from '@material-ui/core'
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'

import {routeTo} from './helpers/routes'
import {provideIntl} from './components/HOC/intl'
import Navbar from './components/visual/Navbar'
import Footer from './components/visual/Footer'

import Home from './screens/Home'
import Blockchain from './screens/Blockchain'
import Staking from './screens/Staking'
import More from './screens/More'
import PageNotFound from './screens/PageNotFound'
import LanguageSelect from '@/components/common/LanguageSelect'

import './App.css'
import seizaLogo from './seiza-logo.png'

// TODO: error handling

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: '#6300C1',
    },
    secondary: {
      main: '#EAF1FF',
    },
    error: red,
  },
})

const TopBar = withRouter(({location: {pathname}}) => {
  return (
    <Grid container direction="row" justify="space-between" alignItems="center">
      <Grid item>
        <img alt="" src={seizaLogo} />
      </Grid>
      <Grid item>
        <Grid container direction="row" alignItems="center">
          <Navbar
            currentPathname={pathname}
            items={[
              {link: routeTo.home(), label: 'Home'},
              {link: routeTo.blockchain(), label: 'Blockchain'},
              {link: routeTo.staking(), label: 'Staking'},
              {link: routeTo.more(), label: 'More'},
            ]}
          />
          <LanguageSelect />
        </Grid>
      </Grid>
    </Grid>
  )
})

const mainLayoutStyles = {
  themeProvider: {
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
}

const App = ({classes}) => {
  return (
    <MuiThemeProvider className={classes.themeProvider} theme={theme}>
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
            <Grid container direction="column">
              <Grid item>
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
            <Footer />
          </div>
        </div>
      </Router>
    </MuiThemeProvider>
  )
}

export default compose(
  provideIntl,
  withStyles(mainLayoutStyles)
)(App)
