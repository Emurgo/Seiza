// @flow
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

import withApolloClient from '../lib/with-apollo-client'
import {InjectHookIntlContext} from '@/i18n/helpers'

import CssBaseline from '@material-ui/core/CssBaseline'

import config from '@/config'
import {ThemeProvider, useTheme} from '@/components/context/theme'
import {CookiesProvider} from '@/components/context/cookies'
import {IntlProvider, useLocale} from '@/components/context/intl'
import {THEME_DEFINITIONS} from '@/themes'
import translations from '@/i18n/locales'

import {CrawlerMetadata, TwitterMetadata, FacebookMetadata} from './_meta'
import {parseCookies, setCookie, destroyCookie} from 'nookies'

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
  const {locale} = useLocale() || 'en'
  return (
    <ReactIntlProvider locale={locale} messages={translations[locale]}>
      {children}
    </ReactIntlProvider>
  )
}

const getCookiesProps = (ctx) => {
  // Note: this is returned for both client and server
  const cookies = parseCookies(ctx || {})

  // Note: this function is returned only when rendered server-side as it is not
  // seriazable
  const _setCookie = (name, value, options = {}) => {
    setCookie(ctx, name, value, options)
  }

  const _destroyCookie = (name) => {
    destroyCookie(ctx, name)
  }

  return {cookies, setCookie: _setCookie, destroyCookie: _destroyCookie}
}

class MyApp extends App {
  static async getInitialProps({Component, ctx}) {
    try {
      let pageProps = {}

      // Component is the "page" to be rendered
      if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx)
      }

      // what is returned here, gets injected into __NEXT_DATA__
      return {
        pageProps,
        cookiesProps: getCookiesProps(ctx),
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
  }
  // ***** END TAKEN FROM: https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js

  // setCookie and destroyCookie (functions in general) can be passed from `getInitialProps`
  // only on server. On client we use "browser" version where we do not need `ctx`.
  getHackedCookieHandlers(cookiesProps) {
    const _setCookie = (...args) => {
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
    const {Component, pageProps, routerCtx, apolloClient, cookiesProps} = this.props

    return (
      <Container>
        <CookiesProvider
          {...{
            cookies: cookiesProps.cookies,
            ...this.getHackedCookieHandlers(cookiesProps),
          }}
        >
          <TwitterMetadata />
          <FacebookMetadata />
          <CrawlerMetadata />
          <ApolloProviders client={apolloClient}>
            <ThemeProvider>
              <MuiProviders>
                <IntlProvider>
                  <Intl>
                    <InjectHookIntlContext>
                      <Component {...pageProps} routerCtx={routerCtx} />
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
