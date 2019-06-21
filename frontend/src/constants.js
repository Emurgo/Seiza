export const ASSURANCE_LEVELS = {
  NORMAL: {
    LOW: 3,
    MEDIUM: 9,
  },
  STRICT: {
    LOW: 5,
    MEDIUM: 15,
  },
}

export const ASSURANCE_LEVELS_VALUES = ASSURANCE_LEVELS.NORMAL

export const APOLLO_CACHE_OPTIONS = {
  CACHE_AND_NETWORK: 'cache-and-network',
  NO_CACHE: 'no-cache',
}

const seoData = {
  title: 'Seiza - Cardano Blockchain Explorer for ADA',
  desc:
    'Seiza is an easy to use webpage to find and verify information in the Cardano blockchain. This blockchain explorer allows you to search for epochs, slots, transactions and addresses.',
  shortDesc: 'Explore and search for Cardano epochs, blocks, transactions and addresses',
  keywords: 'Cardano, Ada, Explorer, Emurgo, Shelley, Goguen, Block Explorer',
  // TODO: make dynamic (note: this needs to be absolute URL)
  logoURL: 'https://seiza.com/og-logo-seiza.png',
}

export const SEO = {
  data: {...seoData},
  twitterData: {
    card: 'summary',
    site: '@seiza_explorer',
    title: seoData.title,
    description: seoData.shortDesc,
    image: seoData.logoURL,
  },

  fbData: {
    'type': 'website',
    'site_name': 'Seiza',
    'locale': 'en_US',
    // ignoring url for now
    // url: 'https://seiza.com/home',
    'title': seoData.title,
    'description': seoData.desc,
    'image:url': seoData.logoURL,
    'image:width': 200,
    'image:hegith': 200,
  },
  escapeAttr(x) {
    // For now just test safety, no real espacing is done
    if (/["<'>]/.test(x)) {
      throw new Error(`unsafe string:${x}`)
    }
    return x
  },
}
