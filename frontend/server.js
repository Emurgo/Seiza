require('dotenv').config()
require('./src/helpers/errorReporting')

const express = require('express')
const next = require('next')
const Sentry = require('@sentry/node')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const cachedApp = require('./serverCache')
const helmet = require('helmet')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const forceHttps = process.env.FORCE_HTTPS === 'true'
const SITEMAP_ROOT = process.env.SITEMAP_ROOT
const DISABLE_CACHING = process.env.DISABLE_CACHING === 'true'

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
  server.use(helmet())

  // https://stackoverflow.com/questions/15119760/what-is-the-smartest-way-to-handle-robots-txt-in-express
  // TODO: not sure whether it is worth to consider sophisticated approach
  server.get('/robots.txt', (req, res) => {
    res.type('text/plain')
    res.send(`Sitemap: ${SITEMAP_ROOT}/sitemap.xml`)
  })

  fixCssCache(server)

  server.use(cookieParser())
  server.use(compression())

  // To get https:// from req.protocol when running on heroku
  server.enable('trust proxy')

  // https://stackoverflow.com/questions/7450940/automatic-https-connection-redirect-with-node-js-express
  server.use ((req, res, next) => {
    // cf-visitor is a custom CloudFlare header we need to use to workaround heroku removing x-forwarded-proto...
    if (req.secure || !forceHttps || req['headers']['cf-visitor']['scheme'] === 'https' ) {
      next()
    } else {
      res.redirect(301, `https://${req.headers.host}${req.url}`)
    }
  })

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

  server.get('/home', (req, res) => {
    return res.redirect(301, '/')
  })

  server.get('*', (req, res) => {
    if (DISABLE_CACHING || req.url.startsWith('/static') || req.url.startsWith('/_next')) {
      return app.render(req, res, '/', req.query)
    } else {
      return cachedApp.render(req, res, {
        getData: () => app.renderToHTML(req, res, '/', req.query),
      })
    }
  })
  // This handles errors if they are thrown before reaching the app
  server.use(Sentry.Handlers.errorHandler())
  // ***** END TAKEN FROM: https://github.com/zeit/next.js/blob/master/examples/with-sentry/server.js

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
