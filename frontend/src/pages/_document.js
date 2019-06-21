// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import React from 'react'
import Document, {Html, Head, Main, NextScript} from 'next/document'
import {SEO} from '@/constants'
import {getThemeFromCookies} from '@/components/HOC/theme'
import {ServerStyleSheets} from '@material-ui/styles'

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
        <Head>
          <meta charSet="utf-8" />
          <meta name="robots" content="index,follow" />

          <meta name="description" content={SEO.escapeAttr(SEO.desc)} />
          <meta name="keywords" content={SEO.escapeAttr(SEO.keywords)} />
          {Object.entries(SEO.twitterData).forEach(([key, value]) => (
            <meta name={`twitter:${key}`} content={SEO.escapeAttr(value)} />
          ))}
          {Object.entries(SEO.fbData).forEach(([key, value]) => (
            <meta name={`og:${key}`} content={SEO.escapeAttr(value)} />
          ))}

          {/* Use minimum-scale=1 to enable GPU rasterization */}
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          {/* We remove auto translate as it causes React apps to fail */}
          <meta name="google" content="notranslate" />
          {/* PWA primary color */}

          <meta name="theme-color" content={getThemeFromCookies()} />

          <link href="/static/assets/css/loadFonts.css" rel="stylesheet" />
          <link rel="shortcut icon" href="/static/favicon.ico" />
          <script src="https://polyfill.io/v3/polyfill.js?features=es6,es7,es2017" />
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
