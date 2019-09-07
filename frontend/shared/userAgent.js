const Bowser = require('bowser')

// Taken from
// https://stackoverflow.com/questions/20084513/detect-search-crawlers-via-javascript
const crawlerRe = /bot|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i

const isCrawler = (userAgent) => crawlerRe.test(userAgent)

// See https://github.com/lancedikson/bowser/blob/master/src/constants.js
const isSupportedBrowser = (userAgent) => {
  const browser = Bowser.getParser(userAgent)
  return !!browser.satisfies({
    chrome: '>57',
    chromium: '>57',
    firefox: '>52',
    opera: '>39',
    edge: '>37',
    // ie is not supported

    // FIXME: safari?

    mobile: {
      safari: '>=10',
      // FIXME: are current android browsers detected as android or as chrome?
      // android: '>3',
    },
  })
}

module.exports = {
  isCrawler,
  isSupportedBrowser,
}
