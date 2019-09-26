const fs = require('fs')
const XmlSplit = require('xmlsplit')

const OUT_DIR = './generated'
const BATCH_SIZE = process.env.BATCH_SIZE || 50
const TAG_NAME = process.env.TAG_NAME || 'sitemap'

const xmlsplitter = new XmlSplit(BATCH_SIZE, TAG_NAME)
const inputStream = fs.createReadStream(`${OUT_DIR}/sitemap.xml`)
let count = 0

inputStream.pipe(xmlsplitter).on('data', (data) => {
  const fname = `${OUT_DIR}/sitemapindex-${count}.xml`
  console.log(`Writing ${fname} ...`)
  fs.writeFile(fname, data.toString(), 'utf8', (err) => {if (err) throw err})
  count++
})
  .on('error', (err) => {
    console.log(err)
  })
