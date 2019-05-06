// @flow

import assert from 'assert'

const graphQLServerUrl = process.env.REACT_APP_GRAPHQL_SERVER_URL
assert(graphQLServerUrl)

const googleAnalyticsId = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
assert(googleAnalyticsId)

const sentryDSN = process.env.REACT_APP_SENTRY_DSN
assert(sentryDSN)

const sentryRelease = process.env.REACT_APP_SENTRY_RELEASE_VERSION
assert(sentryRelease)

export default {
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  showStakingData: process.env.REACT_APP_SHOW_STAKING_DATA === 'true',
  graphQLServerUrl: graphQLServerUrl || '', // flow does not know about above assert
  googleAnalyticsId: googleAnalyticsId || '', // flow does not know about above assert
  sentry: {
    dsn: sentryDSN || '', // flow does not know about above assert
    releaseVersion: sentryRelease || '', // flow does not know about above assert
  },
  isProduction: process.env.NODE_ENV === 'production',
}
