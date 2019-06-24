// @flow
import '@/initErrorReporter'
import '@/App.css'
import '@/utils.css'
import '@/polyfills'

import React, {useMemo, useState, useEffect} from 'react'
import {IntlProvider, addLocaleData} from 'react-intl'
import {ThemeProvider} from '@material-ui/styles'

import App, {Container} from 'next/app'
import Head from 'next/head'

import {ApolloProvider} from 'react-apollo'
import {ApolloProvider as ApolloHooksProvider} from 'react-apollo-hooks'

import {HttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {ApolloClient} from 'apollo-client'
import withApolloClient from '../lib/with-apollo-client'
import {InjectHookIntlContext} from '@/i18n/helpers'

import CssBaseline from '@material-ui/core/CssBaseline'

import config from '@/config'
import {dataIdFromObject} from '@/helpers/apollo'
import {ThemeContextProvider, useThemeContext} from '@/components/HOC/theme'
import {THEME_DEFINITIONS} from '@/components/themes'
import {IntlContextProvider, useLocale} from '@/components/HOC/intl'
import translations from '@/i18n/locales'

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

const client = new ApolloClient({
  // $FlowFixMe Not sure why ApolloLink is not compatible with HttpLink
  link: new HttpLink({uri: config.graphQLServerUrl}),
  cache: new InMemoryCache({
    dataIdFromObject,
  }),
})

const ApolloProviders = ({children}) => {
  return (
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>{children}</ApolloHooksProvider>
    </ApolloProvider>
  )
}

// ***** BEGIN TAKEN FROM: https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js
const MuiProviders = ({children}) => {
  const {currentTheme} = useThemeContext()

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
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
// ***** END TAKEN FROM: https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js

const Intl = ({children}) => {
  const {locale} = useLocale() || 'en'
  return (
    <IntlProvider locale={locale} messages={translations[locale]}>
      {children}
    </IntlProvider>
  )
}

class MyApp extends App {
  static async getInitialProps({Component, ctx}) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    // what is returned here, gets injected into __NEXT_DATA__
    return {
      pageProps,
    }
  }

  // ***** BEGIN TAKEN FROM: https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }
  // ***** END TAKEN FROM: https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js

  render() {
    const {Component, pageProps} = this.props

    return (
      <Container>
        <ApolloProviders>
          <Head>
            <title>Seiza</title>
          </Head>
          <ThemeContextProvider>
            <MuiProviders>
              <IntlContextProvider>
                <Intl>
                  <InjectHookIntlContext>
                    <Component {...pageProps} />
                  </InjectHookIntlContext>
                </Intl>
              </IntlContextProvider>
            </MuiProviders>
          </ThemeContextProvider>
        </ApolloProviders>
      </Container>
    )
  }
}

export default withApolloClient(MyApp)
