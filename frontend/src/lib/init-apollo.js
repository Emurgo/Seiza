// ***** BEGIN TAKEN FROM: https://github.com/zeit/next.js/blob/canary/examples/with-apollo/lib/init-apollo.js
import {HttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {ApolloClient} from 'apollo-client'
import fetch from 'isomorphic-unfetch'

import config from '@/config'
import {dataIdFromObject} from '@/helpers/apollo'

let apolloClient = null

function create(initialState, ssrMode) {
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode,
    link: new HttpLink({
      uri: config.graphQLServerUrl,
      fetch,
    }),
    cache: new InMemoryCache({dataIdFromObject}).restore(initialState || {}),
  })
}

export default function initApollo(initialState, ssrMode = false) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, ssrMode)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, false)
  }

  return apolloClient
}
// ***** END TAKEN FROM: https://github.com/zeit/next.js/blob/canary/examples/with-apollo/lib/init-apollo.js
