// @flow
// TODO: check if google analytics tracks events correctly
// Jira issue: EM-270
import React, {useContext, useEffect} from 'react'

import _ from 'lodash'
import config from '@/config'

import {useAcceptCookies} from '@/components/context/acceptCookies'

// <<<< Google code (https://developers.google.com/analytics/devguides/collection/gtagjs/)
export function gtag(...args: any) {
  window.dataLayer = window.dataLayer || []
  // Note: `...args` are not used instead `arguments` are.
  // As those dont appear to be the same object and google analytics uses `arguments`,
  // we use `...args` only to disable flow errors.
  window.dataLayer.push(arguments) // eslint-disable-line
}
// >>>> Google code

const formatter = (v: string) =>
  v
    .split(' ')
    .map(_.capitalize)
    .join(' ')

// TODO: (discuss with Nico) consider using `event_category` instead of padding both category
// and action to one string.
const trackEvent = (resourceName: string, actionName: string, label?: string) => {
  const f = formatter
  gtag('event', `${f(resourceName)} ${f(actionName)}`, label ? {event_label: label} : {})
}

const useTrackPageVisitEvent = (screenName: string) => {
  const f = formatter
  const {cookiesAccepted} = useAcceptCookies()
  useEffect(() => {
    cookiesAccepted && gtag('event', 'screen_view', {screen_name: f(screenName)})
    // We want to call this only once
  }, []) // eslint-disable-line
}

const trackSearchEvent = (resourceName: string) => trackEvent(resourceName, 'searched')

const trackChartEvent = () => trackEvent('chart', 'interacted')

const trackSubscription = () => trackEvent('subscription', 'requested')

const trackCurrencyChanged = (to: string) => trackEvent('currency', 'changed', to)

const trackSocialIconLink = (linkName: string) => trackEvent(linkName, 'link clicked')

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

type ContextType = {
  useTrackPageVisitEvent: Function,
  trackSearchEvent: Function,
  trackChartEvent: Function,
  trackCurrencyChanged: Function,
  trackSocialIconLink: Function,
  trackSubscription: Function,
}

export const Context = React.createContext<ContextType>({})

type Props = {|
  children: React$Node,
|}

export const AnalyticsProvider = ({children}: Props) => {
  const {cookiesAccepted} = useAcceptCookies()

  // used to make all function "do nothing" until the cookies were not allowed
  const dummyF = () => null

  // Init analytics only when the cookies were accepted
  useEffect(() => {
    cookiesAccepted && initGoogleAnalytics()
  }, [cookiesAccepted])

  const _analytics = _.mapValues(
    {
      trackSearchEvent,
      trackChartEvent,
      trackCurrencyChanged,
      trackSocialIconLink,
      trackSubscription,
    },
    (func) => (cookiesAccepted ? func : dummyF)
  )

  const analytics = {..._analytics, useTrackPageVisitEvent}

  return <Context.Provider value={analytics}>{children}</Context.Provider>
}

export const useAnalytics = () => useContext(Context)
