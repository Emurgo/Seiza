// next.config.js is not transformed by Babel. So you can only use javascript features supported by your version of Node.js.
require('dotenv').config()
const path = require('path')
const Dotenv = require('dotenv-webpack')
const SentryCliPlugin = require('@sentry/webpack-plugin')
const withPlugins = require('next-compose-plugins')
const withCSS = require('@zeit/next-css')
const withSourceMaps = require('@zeit/next-source-maps')
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
      include: './build',
      // We don't necessarily need to specify release,
      // because this is default Sentry's behaviour.
      // We are just being explicit.
      release: process.env.REACT_APP_SENTRY_RELEASE_VERSION,
    }),
  ]
  return config
}

const addEnvironmentVariables = (config) => {
  config.plugins = [
    ...(config.plugins || []),

    // Read the .env file
    new Dotenv({
      path: path.join(__dirname, '.env'),
      systemvars: true,
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
  [[withTranspileModules, {transpileModules: ['@react-google-maps/api']}], withCSS, withSourceMaps],
  {
    webpack: (config, {buildId, dev, isServer, defaultLoaders, webpack}) => {
      // Note: we provide webpack above so you should not `require` it
      // Note: function calls modify webpack config
      addAbsolutePathImport(config)
      addSvgFilesHandling(config)
      !isServer && !dev && addSentryPlugin(config)
      addEnvironmentVariables(config)

      // ***** BEGIN TAKEN FROM: https://github.com/zeit/next.js/blob/master/examples/with-sentry/next.config.js
      if (!isServer) {
        config.resolve.alias['@sentry/node'] = '@sentry/browser'
      }
      // ***** END TAKEN FROM: https://github.com/zeit/next.js/blob/master/examples/with-sentry/next.config.js

      return config
    },
    // this path is relative to the "project dir", which is set to src/ in server.js
    distDir: '../build',
  }
)
