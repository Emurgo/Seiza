const LRU = require('lru-cache')

const MAX_CACHE_SIZE = 150 * 1024 * 1024 // 150MB

const options = {
  max: MAX_CACHE_SIZE,
  length: (n, key) => {
    // This function is used to determine size of cache for every item
    // 1 char in JS should be 2 bytes
    return n.length
  },
  maxAge: 1000 * 20, // 20s
}

const cache = new LRU(options)

const dev = process.env.NODE_ENV !== 'production'

// eslint-disable-next-line
const debugLogger = (...args) => dev ? console.log(...args) : null

const routeToKey = (route, c) => `${route}__currency:${c.currency}__locale:${c.locale}__theme:${c.theme}`

const render = async (req, res, {getData, route}) => {
  const cacheKey = routeToKey(route, req.cookies)
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
