// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import {ApolloClient} from 'apollo-client'
import {ApolloProvider} from 'react-apollo'
import {HttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'

import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

const client = new ApolloClient({
  link: new HttpLink({uri: process.env.REACT_APP_GRAPHQL_SERVER_URL}),
  cache: new InMemoryCache(),
})

const rootElement = document.getElementById('root')

rootElement &&
  ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    rootElement
  )

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
