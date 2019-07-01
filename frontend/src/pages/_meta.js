// @flow
import React from 'react'
import Head from 'next/head'

const seoData = {
  title: 'Seiza - Cardano Blockchain Explorer for ADA',
  desc:
    'Seiza is an easy to use webpage to find and verify information in the Cardano blockchain. This blockchain explorer allows you to search for epochs, slots, transactions and addresses.',
  shortDesc: 'Explore and search for Cardano epochs, blocks, transactions and addresses',
  keywords: 'Cardano, Ada, Explorer, Emurgo, Shelley, Goguen, Block Explorer',
  // TODO: make dynamic (note: this needs to be absolute URL)
  logoURL: 'https://seiza.com/og-logo-seiza.png',
}

/*
 * Note: we can't iterate in next/head, see
 * https://github.com/zeit/next.js/issues/5628
 */

/*
 * Note: <meta> with `key` attribute can be later overriden
 */
export const TwitterMetadata = () => {
  const twitterData = {
    twitterHandle: '@seiza_explorer',
    title: seoData.title,
    description: seoData.shortDesc,
    image: seoData.logoURL,
  }

  return (
    <Head>
      <meta key="twitter:card" name="twitter:card" content="summary" />
      <meta key="twitter:site" name="twitter:site" content={twitterData.twitterHandle} />
      <meta key="twitter:title" name="twitter:title" content={twitterData.title} />
      <meta
        key="twitter:description"
        name="twitter:description"
        content={twitterData.description}
      />
      <meta key="twitter:image" name="twitter:image" content={twitterData.image} />
    </Head>
  )
}

export const FacebookMetadata = () => {
  const fbData = {
    site_name: 'Seiza',
    locale: 'en_US',
    // ignoring url for now
    // url: 'https://seiza.com/home',
    title: seoData.title,
    description: seoData.desc,
    image: {
      url: seoData.logoURL,
      width: 200,
      height: 200,
    },
  }
  return (
    <Head>
      <meta key="og:type" name="og:type" content="website" />
      <meta key="og:site_name" name="og:site_name" content={fbData.site_name} />
      <meta key="og:locale" name="og:locale" content={fbData.locale} />
      <meta key="og:title" name="og:title" content={fbData.title} />
      <meta key="og:description" name="og:description" content={fbData.description} />
      <meta key="og:image:url" name="og:image:url" content={fbData.image.url} />
      <meta key="og:image:width" name="og:image:width" content={fbData.image.width} />
      <meta key="og:image:height" name="og:image:height" content={fbData.image.height} />
    </Head>
  )
}

export const CrawlerMetadata = () => {
  return (
    <Head>
      <title>{seoData.title}</title>
      <meta key="robots" name="robots" content="index,follow" />

      <meta key="description" name="description" content={seoData.desc} />
      <meta key="keywords" name="keywords" content={seoData.keywords} />
    </Head>
  )
}

export const MetadataOverrides = ({title, description}: {title: string, description: string}) => (
  <Head>
    {/* For crawlers + browser title */}
    <title>{title}</title>
    <meta key="description" name="description" content={description} />
    {/* For facebook sharing */}
    <meta key="og:title" name="og:title" content={title} />
    <meta key="og:description" name="og:description" content={description} />
    {/* For twitter/reddit sharing */}
    <meta key="twitter:title" name="twitter:title" content={title} />
    <meta key="twitter:description" name="twitter:description" content={description} />
  </Head>
)
