// @flow
import * as Sentry from '@sentry/browser'
import config from '@/config'
// One important thing to note about the behavior of error boundaries
// in development mode is that React will rethrow errors they catch.
// This will result in errors being reported twice to Sentry,
// but this won’t occur in your production build.
export const reportError = (error: any, info: any): any => {
  if (config.isProduction) {
    Sentry.withScope((scope) => {
      scope.setExtras(info)
      Sentry.captureException(error)
    })
  }
}

export const initErrorReporting = () => {
  Sentry.init({
    dsn: config.sentry.dsn,
    // Note: We need to match release version with the sourcemaps
    // uploaded with webpack Sentry plugin
    release: config.sentry.releaseVersion,
  })
  Sentry.configureScope((scope) => scope.setTag('source', 'frontend'))
}

export const logError = (error: any, info: any): any => {
  console.error('Unexpected error', error, info) // eslint-disable-line
  reportError(error, info)
}
