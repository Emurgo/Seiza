// @flow
import Router from 'next/router'
import {reportError} from '@/helpers/errorReporting'
import '@/App.css'
import '@/utils.css'
import '@/polyfills'

import React, {useMemo, useState, useEffect} from 'react'
import {IntlProvider as ReactIntlProvider, addLocaleData} from 'react-intl'
import {ThemeProvider as MuiThemeProvider} from '@material-ui/styles'

import App, {Container} from 'next/app'
import Head from 'next/head'

import {ApolloProvider} from 'react-apollo'
import {ApolloProvider as ApolloHooksProvider} from 'react-apollo-hooks'
import {parseCookies, setCookie, destroyCookie} from 'nookies'

import withApolloClient from '../lib/with-apollo-client'
import {InjectHookIntlContext} from '@/i18n/helpers'

import CssBaseline from '@material-ui/core/CssBaseline'

import config from '@/config'
import {ThemeProvider, useTheme} from '@/components/context/theme'
import {CookiesProvider} from '@/components/context/cookies'
import {
  IntlProvider,
  useLocale,
  getValidatedLocale,
  DEFAULT_LOCALE,
  LOCALE_KEY,
} from '@/components/context/intl'
import {UserAgentProvider} from '@/components/context/userAgent'

import {THEME_DEFINITIONS, THEMES} from '@/themes'
import translations from '@/i18n/locales'
import {DefaultErrorScreen} from '@/components/common/DefaultErrorBoundary'
import * as urlUtils from '@/helpers/url'
import * as storageUtils from '@/helpers/storage'

import {CrawlerMetadata, TwitterMetadata, FacebookMetadata} from './_meta'

// Note: see https://medium.com/@shalkam/create-react-app-i18n-the-easy-way-b05536c594cb
// for more info
import jaLocaleData from 'react-intl/locale-data/ja'
import ruLocaleData from 'react-intl/locale-data/ru'
import esLocaleData from 'react-intl/locale-data/es'

config.featureEnableRussian && addLocaleData(ruLocaleData)
config.featureEnableSpanish && addLocaleData(esLocaleData)

// Note: This needs to be added otherwise react-intl doesn't know about locale even if you provide
// translations
addLocaleData(jaLocaleData)

const ApolloProviders = ({children, client}) => {
  return (
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>{children}</ApolloHooksProvider>
    </ApolloProvider>
  )
}

// ***** BEGIN TAKEN FROM: https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js
const MuiProviders = ({children}) => {
  const {currentTheme} = useTheme()

  const [forceClientReload, setForceClientReload] = useState(false)
  const theme = useMemo(() => {
    // Note(ppershing): prettier-eslint tends to remove forceClientReload if not stated here
    // eslint-disable-next-line
    forceClientReload
    return {
      // Warning(ppershing): This forces re-load of theme on client which is good
      // bacause otherwise we are left with inconsistent state after hydration
      // and react is unwilling to fix it for us
      ...THEME_DEFINITIONS[currentTheme],
    }
  }, [currentTheme, forceClientReload])

  useEffect(() => {
    setForceClientReload(true)
  }, [])

  return (
    <MuiThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Head>
        {/* Progressive web app primary color */}
        <meta name="theme-color" content={theme.palette.primary.main} />
      </Head>
      {children}
    </MuiThemeProvider>
  )
}
// ***** END TAKEN FROM: https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js

const Intl = ({children}) => {
  const {locale} = useLocale()
  return (
    <ReactIntlProvider locale={locale} messages={translations[locale]}>
      {children}
    </ReactIntlProvider>
  )
}

// Note: for staking section `path` was set to `/staking`, but for some
// reason it did not happen for other pathnames
const getSetCookieArgs = (key, value, options = {}) => {
  const defaultOptions = {path: '/'}
  return [key, value, {...defaultOptions, ...options}]
}

const getCookiesProps = (ctx) => {
  // Note: this is returned for both client and server
  const cookies = parseCookies(ctx || {})

  // Note: this function is returned only when rendered server-side as it is not
  // seriazable
  const _setCookie = (...args) => {
    setCookie(ctx, ...getSetCookieArgs(...args))
  }

  const _destroyCookie = (name) => {
    destroyCookie(ctx, name)
  }

  return {cookies, setCookie: _setCookie, destroyCookie: _destroyCookie}
}

// NOTE!!!
// It would be nice if we did all this logic inside IntlProvider but there are some issues:
// 1. To access url/change in convenient way, we need need IntlProvider defined after Router
// 2. Settings language cookie:
//  a) We can not call setCookie in `useEffect` as it will only run on client, so we would not
//      see desired language in initial load
//  b) We could force `useCookieState` to replace saved state with initial value,
//     but that requires some hack or extra param
// TODO: consider placing IntlProvider under Router and putting that code to IntlProvider
const handleLocaleParam = (ctx, cookiesProps) => {
  const localeParam = ctx.req.query.locale
  if (localeParam) {
    const origUrlQuery = urlUtils.stringify(ctx.req.query)
    const newUrlQuery = urlUtils.replaceQueryParam(origUrlQuery, LOCALE_KEY, null)
    cookiesProps.setCookie(
      LOCALE_KEY,
      storageUtils.toStorageFormat(getValidatedLocale(localeParam))
    )
    ctx.res.writeHead(302, {Location: `${ctx.req.path}${newUrlQuery ? `?${newUrlQuery}` : ''}`})
    ctx.res.end()
  }
}

class MyApp extends App {
  static async getInitialProps({Component, ctx}) {
    try {
      let pageProps = {}

      // Component is the "page" to be rendered
      if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx)
      }

      const cookiesProps = getCookiesProps(ctx)

      // Note: this can set cookie and redirect
      handleLocaleParam(ctx, cookiesProps)

      // what is returned here, gets injected into __NEXT_DATA__
      return {
        pageProps,
        cookiesProps,
        userAgent: ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent,
      }
      // ***** BEGIN INSPIRED BY: https://github.com/zeit/next.js/blob/master/examples/with-sentry/pages/_app.js
    } catch (error) {
      // Capture errors that happen during a page's getInitialProps.
      // This will work on both client and server sides.
      reportError(error, ctx)
      return {
        hasError: true,
      }
    }
    // ***** END INSPIRED BY: https://github.com/zeit/next.js/blob/master/examples/with-sentry/pages/_app.js
  }

  // ***** BEGIN INSPIRED BY: https://github.com/zeit/next.js/blob/master/examples/with-sentry/pages/_app.js
  componentDidCatch(error, errorInfo) {
    reportError(error, {errorInfo})
  }
  // ***** END INSPIRED BY: https://github.com/zeit/next.js/blob/master/examples/with-sentry/pages/_app.js

  // ***** BEGIN TAKEN FROM: https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }

    // See: https://github.com/zeit/next.js/issues/5604
    // Fixes next.js error when clicking browser "back" and going to some url with query param
    Router.beforePopState(({url, as, options}) => false)
  }
  // ***** END TAKEN FROM: https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js

  // setCookie and destroyCookie (functions in general) can be passed from `getInitialProps`
  // only on server. On client we use "browser" version where we do not need `ctx`.
  getHackedCookieHandlers(cookiesProps) {
    const _setCookie = (key, value, options) => {
      const args = getSetCookieArgs(key, value, options)
      if (!process.browser) {
        cookiesProps.setCookie(...args)
      } else {
        setCookie({}, ...args)
      }
    }

    const _destroyCookie = (...args) => {
      if (!process.browser) {
        cookiesProps.destroyCookie(...args)
      } else {
        destroyCookie({}, ...args)
      }
    }

    return {setCookie: _setCookie, destroyCookie: _destroyCookie}
  }

  render() {
    const {
      Component,
      pageProps,
      routerCtx,
      apolloClient,
      cookiesProps,
      hasError,
      userAgent,
    } = this.props

    if (hasError) {
      // Note: we dont have (may not have) cookies in this case,
      // so we default language and theme.
      // Note: we relly that we will not get another error inside those wrappers,
      // (TODO: consider no dependencies error screen)
      return (
        <MuiThemeProvider theme={THEME_DEFINITIONS[THEMES._default]}>
          <ReactIntlProvider locale={DEFAULT_LOCALE} messages={translations[DEFAULT_LOCALE]}>
            <InjectHookIntlContext>
              <DefaultErrorScreen />
            </InjectHookIntlContext>
          </ReactIntlProvider>
        </MuiThemeProvider>
      )
    }

    return (
      <Container>
        <CookiesProvider
          {...{
            cookies: cookiesProps.cookies,
            ...this.getHackedCookieHandlers(cookiesProps),
          }}
        >
          <ApolloProviders client={apolloClient}>
            <ThemeProvider>
              <MuiProviders>
                <IntlProvider>
                  <Intl>
                    <InjectHookIntlContext>
                      <UserAgentProvider userAgent={userAgent}>
                        <TwitterMetadata />
                        <FacebookMetadata />
                        <CrawlerMetadata />
                        <Component {...pageProps} routerCtx={routerCtx} />
                      </UserAgentProvider>
                    </InjectHookIntlContext>
                  </Intl>
                </IntlProvider>
              </MuiProviders>
            </ThemeProvider>
          </ApolloProviders>
        </CookiesProvider>
      </Container>
    )
  }
}

export default withApolloClient(MyApp)
