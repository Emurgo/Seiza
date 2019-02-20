// @flow

import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {withRouter} from 'react-router'
import {compose} from 'redux'
import {CssBaseline, Grid} from '@material-ui/core'
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'

import {routeTo} from './helpers/routes'
import {provideIntl, withSetLocale} from './components/HOC/intl'
import Navbar from './components/visual/Navbar'
import Footer from './components/visual/Footer'

import Home from './screens/Home'
import Blockchain from './screens/Blockchain'
import Staking from './screens/Staking'
import More from './screens/More'
import PageNotFound from './screens/PageNotFound'

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

// TODO: move elsewhere once there is folder structure
const LanguageSwitch = withSetLocale(({setLocale}) => (
  <React.Fragment>
    <button type="button" onClick={() => setLocale('en')}>
      EN
    </button>
    <button type="button" onClick={() => setLocale('es')}>
      ES
    </button>
  </React.Fragment>
))

const TopBar = withRouter(({location: {pathname}}) => {
  return (
    <Grid container direction="row" justify="space-between" alignItems="center">
      <Grid item>
        <img src={seizaLogo} />
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <Navbar
            currentPathname={pathname}
            items={[
              {link: routeTo.home(), label: 'Home'},
              {link: routeTo.blockchain(), label: 'Blockchain'},
              {link: routeTo.staking(), label: 'Staking'},
              {link: routeTo.more(), label: 'More'},
            ]}
          />
          <LanguageSwitch />
        </Grid>
      </Grid>
    </Grid>
  )
})

const App = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <Grid container direction="column">
          <CssBaseline />
          <TopBar />
          <Grid item>
            <Switch>
              <Route exact path={routeTo.home()} component={Home} />
              <Route path={routeTo.blockchain()} component={Blockchain} />
              <Route path={routeTo.staking()} component={Staking} />
              <Route path={routeTo.more()} component={More} />
              <Route component={PageNotFound} />
            </Switch>
          </Grid>
          <Footer />
        </Grid>
      </Router>
    </MuiThemeProvider>
  )
}

export default compose(provideIntl)(App)
