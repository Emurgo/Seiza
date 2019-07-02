// ***** BEGIN TAKEN FROM: https://github.com/zeit/next.js/blob/canary/examples/with-apollo/lib/with-apollo-client.js
import React from 'react'
import initApollo from './init-apollo'
import Head from 'next/head'
import {getDataFromTree} from 'react-apollo'
import {getMarkupFromTree} from 'react-apollo-hooks'
import {renderToString} from 'react-dom/server'

export default (App) => {
  return class Apollo extends React.Component {
    static displayName = 'withApollo(App)'
    static async getInitialProps(ctx) {
      // Component is the "page" to be rendered
      const {
        Component,
        router,
        ctx: {res, req},
      } = ctx

      let appProps = {}
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx)
      }

      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      const apollo = initApollo()
      if (!process.browser) {
        try {
          // Warning(ppershing):
          // routerCtx might be mutated during render!
          const routerCtx = {location: req.originalUrl}

          // Run all GraphQL queries in given React tree to prefetch the data.
          // Promise is resolved once the data are ready in apollo client.
          await getDataFromTree(
            <App
              {...appProps}
              Component={Component}
              router={router}
              apolloClient={apollo}
              routerCtx={routerCtx}
            />
          )
          // router sets ctx.url after <Redirect>
          if (routerCtx.url) {
            res.writeHead(302, {Location: routerCtx.url})
            res.end()
            return {}
          }
          // required for `react-apollo-hooks` to work in SSR
          await getMarkupFromTree({
            renderFunction: renderToString,
            tree: (
              <App
                {...appProps}
                Component={Component}
                router={router}
                apolloClient={apollo}
                routerCtx={routerCtx}
              />
            ),
          })
          // Hopefully we don' get redirect on second pass but better check for it ...
          if (routerCtx.url) {
            res.writeHead(302, {Location: routerCtx.url})
            res.end()
            return {}
          }
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          // eslint-disable-next-line no-console
          console.error('Error while running `getDataFromTree`', error)
        }

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind()
      }

      // Extract query data from the Apollo store
      const apolloState = apollo.cache.extract()

      return {
        routerCtx: {
          // Note: req is not defined on client.
          // However, client does not care about routerCtx
          // as it uses real router
          location: req ? req.originalUrl : null,
        },
        ...appProps,
        apolloState,
      }
    }

    constructor(props) {
      super(props)
      this.apolloClient = initApollo(props.apolloState)
    }

    render() {
      return <App {...this.props} apolloClient={this.apolloClient} />
    }
  }
}
// ***** END TAKEN FROM: https://github.com/zeit/next.js/blob/canary/examples/with-apollo/lib/with-apollo-client.js
