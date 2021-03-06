const LRU = require('lru-cache')
const {isSupportedBrowser, isCrawler} = require('./shared/userAgent')

// 1 char in JS string is 2 bytes
// See: https://kevin.burke.dev/kevin/node-js-string-encoding/
const CHAR_SIZE = 2
const MAX_CACHE_SIZE = 75 * 1024 * 1024 * CHAR_SIZE // 150MB

const options = {
  max: MAX_CACHE_SIZE,
  length: (n, key) => {
    // This function is used to determine size of cache for every item
    // 1 char in JS string is 2 bytes
    // // See: https://kevin.burke.dev/kevin/node-js-string-encoding/
    return n.length
  },
  maxAge: 1000 * 60 * 60, // 1 hour
}

const cache = new LRU(options)

const dev = process.env.NODE_ENV !== 'production'

// eslint-disable-next-line
const debugLogger = (...args) => dev ? console.log(...args) : null

const getCookiesKey = (req) => {
  const c = req.cookies
  return `__currency:${c.currency}__locale:${c.locale}__theme:${c.theme}`
}

const getSupportedBrowserKey = (req) => {
  const userAgent = req.headers['user-agent']
  const isSupported = isSupportedBrowser(userAgent)
  return `__supported:${isSupported}`
}

// Needed in case there is "testnet" error for http, or some
// error related to instance that testnet is proxied into
const getOriginKey = (req) => `__origin:${req.protocol}://${req.headers.host}`

const getUrlKey = (req) => `__route:${req.url}`

const requestToKey = (req) => {
  return `${getOriginKey(req)}${getUrlKey(req)}${getCookiesKey(req)}${getSupportedBrowserKey(req)}`
}

// Note: called 'render' to have compatible naming with nextjs app.render
const render = async (req, res, {getData}) => {
  const userAgent = req.headers['user-agent']
  const route = req.url
  const cacheKey = requestToKey(req)
  let data = cache.get(cacheKey)

  if (data) {
    debugLogger(`Serving ${route} from cache with key: ${cacheKey}`)
  } else {
    debugLogger(`No cache for route ${route} with key: ${cacheKey}`)
    data = await getData()
    !isCrawler(userAgent) && cache.set(cacheKey, data)
  }
  return res.send(data)
}

module.exports = {
  render,
}
