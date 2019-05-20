import createServer from './server'

// TODO: how to distinguish between _logger and logger with request id closured in it?
import _logger from './logger'

const server = createServer()
server.listen({port: process.env.PORT || 4000}).then(({url}) => {
  _logger.log({level: 'info', message: `🚀  Server ready at ${url}`})
})
