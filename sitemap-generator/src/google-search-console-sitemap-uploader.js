require('dotenv').config()
const path = require('path')
const glob = require('glob')
const assert = require('assert')

const OUT_DIR = './generated'
const SITE_URL = process.env.PAGE_ROOT || 'https://seiza.com'
const SITEMAP_ROOT = process.env.SITEMAP_ROOT || 'https://seiza.com/sitemap'
const SERVICE_EMAIL = process.env.SERVICE_EMAIL ||
  assert(process.env.SERVICE_EMAIL, 'Google Service Account email must be provided via SERVICE_EMAIL env variable')
const PRIVATE_KEY = process.env.PRIVATE_KEY ||
  assert(process.env.PRIVATE_KEY, 'Google Service Account private key must be provided via PRIVATE_KEY env variable')

const {google} = require('googleapis')
const jwtClient = new google.auth.JWT(
  SERVICE_EMAIL,
  null,
  PRIVATE_KEY,
  ['https://www.googleapis.com/auth/webmasters'])

const webmaster = google.webmasters({
  version: 'v3',
})

//authenticate request
jwtClient.authorize((err, tokens) => {
  if (err) {
    console.log(err)
    return
  } else {
    console.log('Successfully authorized on Google Search Console API!')
  }
})

// set auth as a global default
google.options({
  auth: jwtClient,
})

const deleteSitemaps = async function() {

  const sitemapListResponse = await webmaster.sitemaps.list({siteUrl: SITE_URL})

  // delete any already submitted sitemap to push google to update it
  if (typeof sitemapListResponse.data.sitemap === 'object') {
    sitemapListResponse.data.sitemap.forEach(async (sitemap) => {
      const feedPath = sitemap.path
      console.log(`Deleting sitemap ${feedPath}...`)
      const response = await webmaster.sitemaps.delete(
        {siteUrl: SITE_URL, feedpath: feedPath}
      )
      console.log(`Google Search Console HTTP response code for ${feedPath} = ${response.status}`)
      return response
    })
  }

}

const submitSitemaps = async function() {

  // submit all the sitemap indexes generated
  glob(`${OUT_DIR}/sitemapindex-[0-9]*.xml`, (err, files) => {
    files.forEach(async (filepath) => {
      const sitemapFile = path.basename(filepath)
      console.log(`Upload sitemap index ${sitemapFile}...`)
      const response = await webmaster.sitemaps.submit({siteUrl: SITE_URL, feedpath: `${SITEMAP_ROOT}/${sitemapFile}`})
      console.log(`Google Search Console HTTP response code for ${sitemapFile} = ${response.status}`)
      return response
    })
  })

}

async function main() {

  await deleteSitemaps().then(async () => {
    // Let some time for Search Console to process the deletion
    // or it will delete new submitted sitemaps also...
    const timer = (ms) => new Promise((res) => setTimeout(res, ms))
    await timer(5000)
    await submitSitemaps()
  })

}

main().catch(console.error)
