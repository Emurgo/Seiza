// ***** BEGIN TAKEN FROM: https://github.com/zeit/next.js/blob/canary/examples/with-apollo/lib/with-apollo-client.js
import React from 'react'
import initApollo from './init-apollo'

export default (App) => {
  return class Apollo extends React.Component {
    static displayName = 'withApollo(App)'
    static async getInitialProps(ctx) {
      // Component is the "page" to be rendered
      const {
        ctx: {req},
      } = ctx

      let appProps = {}
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx)
      }

      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      const apollo = initApollo()

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
