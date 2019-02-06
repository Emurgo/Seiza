// @flow

import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {compose} from 'redux'

import {routeTo} from './helpers/routes'
import {withIntl} from './components/HOC/intl'
import Navbar from './components/visual/Navbar'

import Home from './screens/Home'
import Blockchain from './screens/Blockchain'
import Staking from './screens/Staking'
import More from './screens/More'

import './App.css'

const App = () => {
  return (
    <Router>
      <React.Fragment>
        <Navbar
          items={[
            {link: routeTo.home(), label: 'Home'},
            {link: routeTo.blockchain(), label: 'Blockchain'},
            {link: routeTo.staking(), label: 'Staking'},
            {link: routeTo.more(), label: 'More'},
          ]}
        />
        <Route exact path={routeTo.home()} component={Home} />
        <Route path={routeTo.blockchain()} component={Blockchain} />
        <Route path={routeTo.staking()} component={Staking} />
        <Route path={routeTo.more()} component={More} />
      </React.Fragment>
    </Router>
  )
}

export default compose(
  withIntl,
)(App)
