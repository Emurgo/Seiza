require('dotenv').config()
const express = require('express')
const next = require('next')
require('./src/helpers/errorReporting')
const Sentry = require('@sentry/node')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
// project location (where pages/ directory lives) is ./src
const app = next({dev, dir: './src'})

process.on('unhandledRejection', (err) => {
  Sentry.captureException(err)
})

process.on('uncaughtException', (err) => {
  Sentry.captureException(err)
})

app.prepare().then(() => {
  const server = express()

  // ***** BEGIN TAKEN FROM: https://github.com/zeit/next.js/blob/master/examples/with-sentry/server.js
  // This attaches request information to sentry errors
  server.use(Sentry.Handlers.requestHandler())
  server.get('*', (req, res) => {
    return app.render(req, res, '/', req.query)
  })
  // This handles errors if they are thrown before reaching the app
  server.use(Sentry.Handlers.errorHandler())
  // ***** END TAKEN FROM: https://github.com/zeit/next.js/blob/master/examples/with-sentry/server.js

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
