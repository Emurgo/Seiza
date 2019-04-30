// @flow

import _ from 'lodash'
import config from '@/config'

// <<<< Google code (https://developers.google.com/analytics/devguides/collection/gtagjs/)
window.dataLayer = window.dataLayer || []
export function gtag(...args: any) {
  // Note: `...args` are not used instead `arguments` are.
  // As those dont appear to be the same object and google analytics uses `arguments`,
  // we use `...args` only to disable flow errors.
  window.dataLayer.push(arguments) // eslint-disable-line
}
// >>>> Google code

const formatter = (v: string) => _.capitalize(v)

export const logSearchEvent = (resourceName: string, extras: {} = {}) => {
  const f = formatter
  gtag('event', `${f(resourceName)} ${f('searched')}`, extras)
}

const includeAnalyticsScript = () => {
  const {googleAnalyticsId} = config
  const googleAnalyticsUrl = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`

  const head = document.getElementsByTagName('head')[0]
  const script = document.createElement('script')
  script.src = googleAnalyticsUrl
  script.type = 'text/javascript'
  script.async = true

  head.appendChild(script)
}

const initDataLayer = () => {
  const {googleAnalyticsId} = config

  gtag('js', new Date())
  // https://developers.google.com/analytics/devguides/collection/gtagjs/ip-anonymization
  gtag('config', googleAnalyticsId, {anonymize_ip: true, app_name: 'seiza'})
  gtag('set', 'anonymizeIp', true)
}

export const initGoogleAnalytics = () => {
  includeAnalyticsScript()
  initDataLayer()
}
