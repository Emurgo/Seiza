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

// TODO: (discuss with Nico) consider using `event_category` instead of padding both category
// and action to one string.
const trackEvent = (resourceName: string, actionName: string, label?: string) => {
  const f = formatter
  gtag('event', `${f(resourceName)} ${f(actionName)}`, label ? {event_label: label} : {})
}

const trackSearchEvent = (resourceName: string) => {
  return trackEvent(resourceName, 'searched')
}

const trackChartEvent = () => {
  return trackEvent('chart', 'interacted')
}

const trackCurrencyChanged = (to: string) => {
  return trackEvent('currency', 'changed', to)
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

const initGoogleAnalytics = () => {
  includeAnalyticsScript()
  initDataLayer()
}

export default {
  trackSearchEvent,
  trackChartEvent,
  trackCurrencyChanged,
  initGoogleAnalytics,
}
