import * as Sentry from '@sentry/browser'
import config from '@/config'

config.isProduction &&
  Sentry.init({
    dsn: config.sentry.dsn,
    // Note: We need to match release version with the sourcemaps
    // uploaded with webpack Sentry plugin
    release: config.sentry.releaseVersion,
  })
