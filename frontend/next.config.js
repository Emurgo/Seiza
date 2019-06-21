// next.config.js is not transformed by Babel. So you can only use javascript features supported by your version of Node.js.
require('dotenv').config()
const path = require('path')
const SentryCliPlugin = require('@sentry/webpack-plugin')
const withPlugins = require('next-compose-plugins')
const withCSS = require('@zeit/next-css')
const withTranspileModules = require('next-transpile-modules')
const _ = require('lodash')

const addAbsolutePathImport = (config) => {
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    '@': path.resolve(__dirname, 'src'),
  }

  return config
}

// Uploads files (including sourcemaps) to Sentry
// Uses SENTRY_* env variables
const addSentryPlugin = (config) => {
  config.plugins = [
    ...(config.plugins || []),
    new SentryCliPlugin({
      include: './src/.next',
      // We don't necessarily need to specify release,
      // because this is default Sentry's behaviour.
      // We are just being explicit.
      release: process.env.REACT_APP_SENTRY_RELEASE_VERSION,
    }),
  ]
  return config
}

const addSvgFilesHandling = (config) => {
  config.module.rules = [
    ...(config.module.rules || []),
    {
      test: /\.svg$/,
      use: ['@svgr/webpack', 'url-loader'],
    },
  ]
  return config
}

module.exports = withPlugins(
  [[withTranspileModules, {transpileModules: ['@react-google-maps/api']}], withCSS],
  {
    webpack: (config, {buildId, dev, isServer, defaultLoaders, webpack}) => {
      // Note: we provide webpack above so you should not `require` it
      // Note: function calls modify webpack config
      addAbsolutePathImport(config)
      addSvgFilesHandling(config)
      !isServer && !dev && addSentryPlugin(config)
      return config
    },
    env: {
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
    },
  }
)
