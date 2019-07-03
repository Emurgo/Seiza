// ***** BEGIN INSPIRED BY https://github.com/zeit/next.js/blob/master/examples/with-sentry/utils/sentry.js
// NOTE: This require will be replaced with `@sentry/browser` when
// process.browser === true thanks to the webpack config in next.config.js
const Sentry = require('@sentry/node')
const SentryIntegrations = require('@sentry/integrations')

// TODO: In this file we're not using environment variables from @/config
// because it uses imports and we need this code to be working
// also with server (which uses CommonJS at the moment)

const sentryOptions = {
  dsn: process.env.REACT_APP_SENTRY_DSN,
  // Note: We need to match release version with the sourcemaps
  // uploaded with webpack Sentry plugin
  release: process.env.REACT_APP_SENTRY_RELEASE_VERSION,
  attachStacktrace: true,
}

// When we're developing locally
if (process.env.NODE_ENV !== 'production') {
  /* eslint-disable-next-line global-require */
  const sentryTestkit = require('sentry-testkit')
  const {sentryTransport} = sentryTestkit()

  // Don't actually send the errors to Sentry
  // $FlowFixMe adding property to object
  sentryOptions.transport = sentryTransport

  // Instead, dump the errors to the console
  // $FlowFixMe adding property to object
  sentryOptions.integrations = [
    new SentryIntegrations.Debug({
      // Trigger DevTools debugger instead of using console.log
      debugger: false,
    }),
  ]
}

Sentry.init(sentryOptions)

const reportError = (err, ctx) => {
  Sentry.configureScope((scope) => {
    scope.setTag('source', 'frontend')

    if (err.message) {
      // De-duplication currently doesn't work correctly for SSR / browser errors
      // so we force deduplication by error message if it is present
      scope.setFingerprint([err.message])
    }

    if (err.statusCode) {
      scope.setExtra('statusCode', err.statusCode)
    }

    if (ctx) {
      const {req, res, errorInfo, query, pathname} = ctx

      if (res && res.statusCode) {
        scope.setExtra('statusCode', res.statusCode)
      }

      if (process.browser) {
        scope.setTag('ssr', false)
        scope.setExtra('query', query)
        scope.setExtra('pathname', pathname)
      } else {
        scope.setTag('ssr', true)
        scope.setExtra('url', req.url)
        scope.setExtra('method', req.method)
        scope.setExtra('headers', req.headers)
        scope.setExtra('params', req.params)
        scope.setExtra('query', req.query)
      }

      if (errorInfo) {
        Object.keys(errorInfo).forEach((key) => scope.setExtra(key, errorInfo[key]))
      }
    }
  })

  return Sentry.captureException(err)
}
// ***** END INSPIRED BY https://github.com/zeit/next.js/blob/master/examples/with-sentry/utils/sentry.js

module.exports = {
  reportError,
}
