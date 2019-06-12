const args = require('minimist')(process.argv.slice(2))

module.exports = {
  URL: args.backend || 'http://localhost:4000',
  MAX_WORKERS: args.workers || 10,
  START_BLOCK: args.start_block != null ? +args.start_block : null,
}
