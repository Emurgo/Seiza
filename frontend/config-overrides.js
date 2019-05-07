const path = require('path')
const {override, addBabelPlugin} = require('customize-cra')
const SentryCliPlugin = require('@sentry/webpack-plugin')

const addAbsolutePathImport = (config) => {
  config.resolve = {
    ...config.resolve,
    alias: {'@': path.resolve(__dirname, 'src')},
  }

  return config
}

// Uploads files (including sourcemaps) to Sentry
// Uses SENTRY_* env variables
const addSentryPlugin = (config) => {
  config.plugins = [
    ...config.plugins,
    new SentryCliPlugin({
      include: './build',
      // We don't necessarily need to specify release,
      // because this is default Sentry's behaviour.
      // We are just being explicit.
      release: process.env.REACT_APP_SENTRY_RELEASE_VERSION,
    }),
  ]
  return config
}

module.exports = override(
  addBabelPlugin(['react-intl-auto', {removePrefix: 'src/', filebase: true}]),
  addAbsolutePathImport,
  process.env.NODE_ENV === 'production' && addSentryPlugin
)
