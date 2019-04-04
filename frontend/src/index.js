// @flow
import './index.css'
import './utils.css'
import 'font-awesome/css/font-awesome.min.css'
import './polyfills'

import React from 'react'
import ReactDOM from 'react-dom'
import {ApolloProvider} from 'react-apollo'
import {ApolloProvider as ApolloHooksProvider} from 'react-apollo-hooks'

import {HttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {ApolloClient} from 'apollo-client'

import App from './App'
import config from './config'
import * as serviceWorker from './serviceWorker'
import {dataIdFromObject} from './helpers/apollo'

const client = new ApolloClient({
  // $FlowFixMe Not sure why ApolloLink is not compatible with HttpLink
  link: new HttpLink({uri: config.graphQLServerUrl}),
  cache: new InMemoryCache({
    dataIdFromObject,
  }),
})

const render = (Component) => {
  const root = document.getElementById('root')
  return (
    root &&
    ReactDOM.render(
      <ApolloProvider client={client}>
        <ApolloHooksProvider client={client}>
          <App />
        </ApolloHooksProvider>
      </ApolloProvider>,
      root
    )
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    render(NextApp)
  })
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
