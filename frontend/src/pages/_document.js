// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import React from 'react'
import Document, {Html, Main, NextScript, Head} from 'next/document'
import {ServerStyleSheets} from '@material-ui/styles'
import config from '@/config'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    // ***** BEGIN TAKEN FROM: https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_document.js
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render

    // Render app and page and get the context of the page with collected side effects.
    const sheets = new ServerStyleSheets()
    const originalRenderPage = ctx.renderPage

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
      })
    // ***** END TAKEN FROM: https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_document.js

    const initialProps = await Document.getInitialProps(ctx)

    return {
      ...initialProps,
      // ***** BEGIN TAKEN FROM: https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_document.js
      // Styles fragment is rendered after the app and page rendering finish.
      styles: (
        <React.Fragment>
          {initialProps.styles}
          {sheets.getStyleElement()}
        </React.Fragment>
      ),
      // ***** END TAKEN FROM: https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_document.js
    }
  }

  render() {
    return (
      <Html>
        {/*
            Note(ppershing): this head is non-overrideable,
            store overrideable parts in _app.js
        */}
        <Head>
          <meta charSet="utf-8" />
          {/* Use minimum-scale=1 to enable GPU rasterization */}
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          {/* We remove auto translate as it causes React apps to fail */}
          <meta name="google" content="notranslate" />
          <link rel="preconnect" href={config.graphQLServerUrl} />
          <link href="/static/assets/css/loadFonts.css" rel="prefetch" as="style" />
          <link rel="shortcut icon" href="/static/favicon.ico" />
          {process.browser && (
            <script src="https://polyfill.io/v3/polyfill.js?features=es6,es7,es2017" />
          )}
        </Head>
        <body className="notranslate">
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <div id="root" />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
