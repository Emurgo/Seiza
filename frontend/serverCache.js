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

const routeToKey = {
  '/home': (c) => `/home:__currency:${c.currency}__locale:${c.locale}__theme:${c.theme}`,
}

const render = async (req, res, {getData, route}) => {
  const cacheKey = routeToKey[route](req.cookies)
  let data = cache.get(cacheKey)
  if (data) {
    debugLogger(`Serving ${route} from cache with key ${cacheKey}`)
    return res.send(data)
  } else {
    debugLogger(`No cache for route ${route} with key ${cacheKey}`)
    data = await getData()
    cache.set(cacheKey, data)
    return res.send(data)
  }
}

module.exports = {
  render,
}
