// @flow
import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import {ApolloProvider} from 'react-apollo'
import {HttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {ApolloClient} from 'apollo-client'

import App from './App'
import * as serviceWorker from './serviceWorker'

const client = new ApolloClient({
  link: new HttpLink({uri: process.env.REACT_APP_GRAPHQL_SERVER_URL}),
  cache: new InMemoryCache(),
})

const render = (Component) => {
  const root = document.getElementById('root')
  return (
    root &&
    ReactDOM.render(
      <ApolloProvider client={client}>
        <App />
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
