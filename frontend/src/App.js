import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import './App.css'

import {pathBuilder} from './helpers/routes'

import Home from './screens/Home'
import Blockchain from './screens/Blockchain'
import Staking from './screens/Staking'
import More from './screens/More'

import Navigation from './components/visual/Navigation'

const App = () => {
  return (
    <Router>
      <React.Fragment>
        <Navigation
          items={[
            {link: pathBuilder.home(), label: 'Home'},
            {link: pathBuilder.blockchain(), label: 'Blockchain'},
            {link: pathBuilder.staking(), label: 'Staking'},
            {link: pathBuilder.more(), label: 'More'},
          ]}
        />
        <Route exact path={pathBuilder.home()} component={Home} />
        <Route path={pathBuilder.blockchain()} component={Blockchain} />
        <Route path={pathBuilder.staking()} component={Staking} />
        <Route path={pathBuilder.more()} component={More} />
      </React.Fragment>
    </Router>
  )
}

export default App
