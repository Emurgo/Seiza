// Taken from
// https://stackoverflow.com/questions/20084513/detect-search-crawlers-via-javascript
const re = /bot|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i

export const isCrawler = re.test(navigator.userAgent)

export default {
  isCrawler,
}
