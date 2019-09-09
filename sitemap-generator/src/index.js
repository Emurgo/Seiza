require('dotenv').config()
const _ = require('lodash')
const {promisify} = require('util')
const fs = require('fs')
const fse = require('fs-extra')
const xmlbuilder = require('xmlbuilder')

const elastic = require('./elastic')

const writeFile = promisify(fs.writeFile)

const PAGE_ROOT = process.env.PAGE_ROOT || 'http://seiza.com'
const SITEMAP_ROOT = process.env.SITEMAP_ROOT || 'http://seiza.com'

const OUT_DIR = './generated'

const buildSitemapIndex = (shards) => {
  let doc = xmlbuilder
    .create('sitemapindex', {encoding: 'utf-8'})
    .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')

  Object.entries(shards).forEach(([shard, pages]) => {
    doc = doc
      .ele('sitemap')
      .ele('loc', `${SITEMAP_ROOT}/sitemap-${shard}.xml`)
      .up()
      .ele('lastmod', _.max(pages, (p) => p.timestamp).timestamp)
      .up()
      .up()
  })

  return doc.end({pretty: true})
}

const buildSitemap = (pages) => {
  let doc = xmlbuilder
    .create('urlset', {encoding: 'utf-8'})
    .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')

  pages.forEach(({url, timestamp, changeFreq, priority}) => {
    doc = doc
      .ele('url')
      .ele('loc', url)
      .up()
      .ele('lastmod', timestamp)
      .up()
      .ele('changefreq', changeFreq)
      .up()
      .ele('priority', priority)
      .up()
      .up()
  })
  return doc.end({pretty: true})
}

const build_sitemap = async (pages) => {
  const _write = (fname, content) => {
    // eslint-disable-next-line no-console
    console.log(`Writing ${fname} ...`)
    return writeFile(`${OUT_DIR}/${fname}`, content)
  }

  const shards = _.groupBy(pages, (p) => p.shard)

  for (const [shard, pages] of Object.entries(shards)) {
    await _write(`sitemap-${shard}.xml`, buildSitemap(pages))
  }

  await _write('sitemap.xml', buildSitemapIndex(shards))
}

const main = async () => {
  fse.removeSync(OUT_DIR)
  fs.mkdirSync(OUT_DIR)
  const pages = {}

  const it = elastic.scrollingSearch('slot', {
    size: 10000,

    query: {
      bool: {
        filter: [
          // Uncomment for debugging
          /*
          {
            range: {
              epoch: {
                lte: 10,
              },
            },
          },
          */
        ],
      },
    },
    _source: ['epoch', 'slot', 'hash', 'time', 'tx.addresses.address', 'tx.hash'],
  })

  const progress = (x, y) => `${x} / ${y} - ${Math.round((x / y) * 100)}%`
  const _max = (a, b) => (a < b || a == null ? b : a)

  for await (const {hits, total, cntDone} of it) {
    // eslint-disable-next-line no-console
    console.log(progress(cntDone, total))
    for (const hit of hits) {
      const slot = hit._source

      pages[`epoch-${slot.epoch}`] = {
        shard: 'epochs',
        url: `${PAGE_ROOT}/blockchain/epoch/${slot.epoch}`,
        timestamp: _max((pages[`epoch-${slot.epoch}`] || {}).timestamp, slot.time),
        // There are only a few epochs so it isn't worth specifying
        // "never" for old ones
        changeFreq: 'always',
        priority: 0.5,
      }

      pages[slot.hash] = {
        shard: `epoch_${slot.epoch}-blocks`,
        url: `${PAGE_ROOT}/blockchain/block/${slot.hash}`,
        timestamp: slot.time,
        changeFreq: 'never',
        priority: 0.5,
      }

      slot.tx &&
        slot.tx.forEach((tx) => {
          pages[tx.hash] = {
            shard: `epoch_${slot.epoch}-txs_${Math.floor(slot.slot / 5000)}`,
            url: `${PAGE_ROOT}/blockchain/transaction/${tx.hash}`,
            timestamp: slot.time,
            changeFreq: 'never',
            priority: 0.5,
          }

          tx.addresses &&
            tx.addresses.forEach(({address}) => {
              pages[address] = {
                // Note: last 2 characters should be semi-random
                shard: `addresses_${address.slice(-2)}`,
                url: `${PAGE_ROOT}/blockchain/address/${address}`,
                timestamp: _max((pages[address] || {}).timestamp, slot.time),
                // TODO: maybe estimate on address activity?
                changeFreq: 'daily',
                priority: 0.5,
              }
            })
        })
    }
  }

  await build_sitemap(pages)

  process.exit(0)
}

main()
