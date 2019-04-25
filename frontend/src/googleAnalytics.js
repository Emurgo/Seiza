import assert from 'assert'
import config from './config'

const getAnalyticsId = () => {
  const {googleAnalyticsId} = config
  assert(googleAnalyticsId)
  return googleAnalyticsId
}

const includeAnalyticsScript = () => {
  const googleAnalyticsId = getAnalyticsId()
  const googleAnalyticsUrl = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`

  const head = document.getElementsByTagName('head')[0]
  const script = document.createElement('script')
  script.src = googleAnalyticsUrl
  script.type = 'text/javascript'
  script.async = true

  head.appendChild(script)
}

const initDataLayer = () => {
  const googleAnalyticsId = getAnalyticsId()

  // Google code (https://developers.google.com/analytics/devguides/collection/gtagjs/)
  /*eslint-disable */

  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  gtag('js', new Date())
  gtag('config', googleAnalyticsId)

  /*eslint-enable */
  // Google code
}

export const initGoogleAnalytics = () => {
  includeAnalyticsScript()
  initDataLayer()
}
