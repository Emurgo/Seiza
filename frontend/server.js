require('dotenv').config()
const express = require('express')
const next = require('next')
require('./src/helpers/errorReporting')
const Sentry = require('@sentry/node')
const compression = require('compression')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const SITEMAP_ROOT = process.env.SITEMAP_ROOT
// project location (where pages/ directory lives) is ./src
const app = next({dev, dir: './src'})

process.on('unhandledRejection', (err) => {
  Sentry.captureException(err)
})

process.on('uncaughtException', (err) => {
  Sentry.captureException(err)
})

const fixCssCache = (server) => {
  // https://github.com/zeit/next-plugins/issues/243
  // This should be fixed in next.js v9, however there are other babel issues in nextjs v9,
  // so update when nextjs v9 is finally fixed
  if (!dev) {
    server.get(/^\/_next\/static\/css\//, (_, res, nextHandler) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
      nextHandler()
    })
  }
}

app.prepare().then(() => {
  const server = express()

  // https://stackoverflow.com/questions/15119760/what-is-the-smartest-way-to-handle-robots-txt-in-express
  // TODO: not sure whether it is worth to consider sophisticated approach
  server.get('/robots.txt', (req, res) => {
    res.type('text/plain')
    res.send(`Sitemap: ${SITEMAP_ROOT}/sitemap.xml`)
  })

  fixCssCache(server)

  server.use(compression())

  // https://github.com/zeit/next.js/issues/1791
  server.use(
    '/static',
    express.static(`${__dirname}/src/static`, {
      maxAge: '1d',
    })
  )

  // ***** BEGIN TAKEN FROM: https://github.com/zeit/next.js/blob/master/examples/with-sentry/server.js
  // This attaches request information to sentry errors
  server.use(Sentry.Handlers.requestHandler())

  // Note: performance boost, also consider other redirects and making
  // this nicer (share routes somehow?)
  server.get('/', (req, res) => {
    return res.redirect(301, '/home')
  })

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
