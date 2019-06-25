// @flow
import assert from 'assert'
import localStorage from '@/helpers/localStorage'

const isProduction = process.env.NODE_ENV === 'production'

// ***** Next.js environment variables explanation

// publicRuntimeConfig
// 1. publicRuntimeConfig gets filled within next.config.js
// 2. next.config.js is run twice: during build and also during start
// 3. Variables defined within publicRuntimeConfig get redefined during build,
//    but also start script.
//    (e.g. if variable was defined inline during build script,
//    it gets overwritten by value during start script)

// process.env
// 1. Variables defined during build get bundled with help of dotenv-webpack plugin
// 2. Variables defined inline during build script aren't accessible during
//    runtime by destructuring {...process.env},
//    but need to be accessed directly with process.env.SOMETHING
// 3. When some variables are defined inline within "start" script,
//    they will not be available in bundle.

const env = {
  REACT_APP_SENTRY_RELEASE_VERSION: process.env.REACT_APP_SENTRY_RELEASE_VERSION,
  REACT_APP_GRAPHQL_SERVER_URL: process.env.REACT_APP_GRAPHQL_SERVER_URL,
  REACT_APP_GOOGLE_ANALYTICS_ID: process.env.REACT_APP_GOOGLE_ANALYTICS_ID,
  REACT_APP_SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN,
  REACT_APP_GOOGLE_MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  REACT_APP_SHOW_STAKING_DATA: process.env.REACT_APP_SHOW_STAKING_DATA,
  REACT_APP_FEATURE_ENABLE_THEMES: process.env.REACT_APP_FEATURE_ENABLE_THEMES,
  REACT_APP_FEATURE_ENABLE_RUSSIAN: process.env.REACT_APP_FEATURE_ENABLE_RUSSIAN,
  REACT_APP_FEATURE_ENABLE_SPANISH: process.env.REACT_APP_FEATURE_ENABLE_SPANISH,
  REACT_SHOW_STAKE_POOLS_LIST_DATA: process.env.REACT_SHOW_STAKE_POOLS_LIST_DATA,
  REACT_APP_ENABLE_ENV_OVERRIDES: process.env.REACT_APP_ENABLE_ENV_OVERRIDES,
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

const envOverridesEnabled = env.REACT_APP_ENABLE_ENV_OVERRIDES === 'true'

if (envOverridesEnabled) {
  OVERRIDABLE_ENV.forEach((_key) => {
    const key = `env.${_key}`
    const value = localStorage.getItem(key)
    if (value != null) {
      // eslint-disable-next-line no-console
      console.warn(`Overriding process.env.${_key} from "${env[_key] || ''}" to "${value}"`) // env[_key] || '' to fix flow error
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
  envOverridesEnabled,

  googleMapsApiKey: env.REACT_APP_GOOGLE_MAPS_API_KEY,
  graphQLServerUrl: graphQLServerUrl || '', // flow does not know about above assert
  googleAnalyticsId: googleAnalyticsId || '', // flow does not know about above assert
  sentry: {
    dsn: sentryDSN || '', // flow does not know about above assert
    releaseVersion: sentryRelease || '', // flow does not know about above assert
  },

  // TODO: rename me once #633 is merged in
  showStakingData: env.REACT_APP_SHOW_STAKING_DATA === 'true',
  showStakePoolsListData: (env.REACT_SHOW_STAKE_POOLS_LIST_DATA = 'true'),

  featureEnableThemes: env.REACT_APP_FEATURE_ENABLE_THEMES === 'true',
  featureEnableRussian: env.REACT_APP_FEATURE_ENABLE_RUSSIAN === 'true',
  featureEnableSpanish: env.REACT_APP_FEATURE_ENABLE_SPANISH === 'true',
}
