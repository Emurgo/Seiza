// @flow

import assert from 'assert'

const isProduction = process.env.NODE_ENV === 'production'

// clone
const env = {
  ...process.env,
}

export const OVERRIDABLE_ENV = [
  'REACT_APP_GRAPHQL_SERVER_URL',
  'REACT_APP_GOOGLE_ANALYTICS_ID',
  'REACT_APP_SENTRY_DSN',
  'REACT_APP_SENTRY_RELEASE_VERSION',
  'REACT_APP_GOOGLE_MAPS_API_KEY',

  // TODO: rename to FEATURE_
  'REACT_APP_SHOW_STAKING_DATA',
  'REACT_APP_FEATURE_ENABLE_THEMES',

  'REACT_APP_FEATURE_ENABLE_RUSSIAN',
  'REACT_APP_FEATURE_ENABLE_SPANISH',
]

if (!isProduction) {
  OVERRIDABLE_ENV.forEach((_key) => {
    const key = `env.${_key}`
    const value = localStorage.getItem(key)
    if (value != null) {
      // eslint-disable-next-line no-console
      console.warn(`Overriding process.env.${_key} from "${env[_key]}" to "${value}"`)
      env[_key] = value
    }
  })
}

const graphQLServerUrl = env.REACT_APP_GRAPHQL_SERVER_URL
assert(graphQLServerUrl)

const googleAnalyticsId = env.REACT_APP_GOOGLE_ANALYTICS_ID
isProduction && assert(googleAnalyticsId)

const sentryDSN = env.REACT_APP_SENTRY_DSN
isProduction && assert(sentryDSN)

const sentryRelease = env.REACT_APP_SENTRY_RELEASE_VERSION
isProduction && assert(sentryRelease)

export default {
  isProduction,

  googleMapsApiKey: env.REACT_APP_GOOGLE_MAPS_API_KEY,
  graphQLServerUrl: graphQLServerUrl || '', // flow does not know about above assert
  googleAnalyticsId: googleAnalyticsId || '', // flow does not know about above assert
  sentry: {
    dsn: sentryDSN || '', // flow does not know about above assert
    releaseVersion: sentryRelease || '', // flow does not know about above assert
  },


  // TODO: rename me once #633 is merged in
  showStakingData: env.REACT_APP_SHOW_STAKING_DATA === 'true',
  showStakePoolsListData: env.REACT_SHOW_STAKE_POOLS_LIST_DATA = 'true',

  featureEnableThemes: env.REACT_APP_FEATURE_ENABLE_THEMES === 'true',
  featureEnableRussian: env.REACT_APP_FEATURE_ENABLE_RUSSIAN === 'true',
  featureEnableSpanish: env.REACT_APP_FEATURE_ENABLE_SPANISH === 'true',
}
