// @flow

import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {compose} from 'redux'
import CssBaseline from '@material-ui/core/CssBaseline'
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import indigo from '@material-ui/core/colors/indigo'
import red from '@material-ui/core/colors/red'

import {routeTo} from './helpers/routes'
import {provideIntl, withSetLocale} from './components/HOC/intl'
import Navbar from './components/visual/Navbar'

import Home from './screens/Home'
import Blockchain from './screens/Blockchain'
import Staking from './screens/Staking'
import More from './screens/More'
import PageNotFound from './screens/PageNotFound'
import Transaction from './screens/Transaction'
import Address from './screens/Address'

import './App.css'
import seizaLogo from './seiza-logo.png'

// TODO: error handling

// TODO: define and store themes in proper place
const theme = createMuiTheme({
  typography: {
    useNextVariants: true, // TODO
  },
  palette: {
    primary: indigo,
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

const styles = {
  topbar: {
    display: 'flex',
    borderBottom: '1px solid gray',
  },
}
const Spacer = () => <div style={{flexGrow: 1}} />

const TopBar = () => (
  <div style={styles.topbar}>
    <img src={seizaLogo} />
    <Spacer />
    <Navbar
      items={[
        {link: routeTo.home(), label: 'Home'},
        {link: routeTo.blockchain(), label: 'Blockchain'},
        {link: routeTo.staking(), label: 'Staking'},
        {link: routeTo.more(), label: 'More'},
      ]}
    />
    <LanguageSwitch />
  </div>
)

const App = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <React.Fragment>
          <CssBaseline />
          <TopBar />
          <Switch>
            <Route exact path={routeTo.home()} component={Home} />
            <Route path={routeTo.blockchain()} component={Blockchain} />
            <Route path={routeTo.staking()} component={Staking} />
            <Route path={routeTo.more()} component={More} />
            <Route path={routeTo.transaction(':txHash')} component={Transaction} />
            <Route path={routeTo.address(':address58')} component={Address} />
            <Route component={PageNotFound} />
          </Switch>
        </React.Fragment>
      </Router>
    </MuiThemeProvider>
  )
}

export default compose(provideIntl)(App)
