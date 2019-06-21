// Taken from
// https://stackoverflow.com/questions/20084513/detect-search-crawlers-via-javascript
const re = /bot|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i

// TODO: process.browser is just temporary, rethink for SSR
// Jira issue: EM-269
export const isCrawler = process.browser && re.test(navigator.userAgent)

export default {
  isCrawler,
}
