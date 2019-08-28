const LRU = require('lru-cache')

const MAX_CACHE_SIZE = 30 * 1024 * 1024 // 30MB

const options = {
  max: MAX_CACHE_SIZE,
  length: (n, key) => {
    // This function is used to determine size of cache for every item
    // 1 char in JS should be 2 bytes
    return n.length
  },
  maxAge: 1000 * 60 * 60 * 24, // 1d
}

const cache = new LRU(options)

const dev = process.env.NODE_ENV !== 'production'

// eslint-disable-next-line
const debugLogger = (...args) => dev ? console.log(...args) : null

const commonRouteKey = (c) => `__currency:${c.currency}__locale:${c.locale}__theme:${c.theme}`

const routeToKey = {
  '/home': (c) => `/home:${commonRouteKey(c)}`,
  '/blockchain': (c) => `/blockchain:${commonRouteKey(c)}`,
}

const render = async (req, res, {getData, route}) => {
  const cacheKey = routeToKey[route] && routeToKey[route](req.cookies)
  let data = cache.get(cacheKey)
  if (data) {
    debugLogger(`Serving ${route} from cache with key ${cacheKey}`)
    return res.send(data)
  } else {
    debugLogger(`No cache for route ${route} with key ${cacheKey}`)
    data = await getData()
    if (cacheKey) {
      cache.set(cacheKey, data)
    } else {
      debugLogger(`No cache key for ${route}`)
    }
    return res.send(data)
  }
}

module.exports = {
  render,
}
