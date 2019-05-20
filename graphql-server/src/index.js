import createServer from './server'

const server = createServer()
server.listen({port: process.env.PORT || 4000}).then(({url}) => {
  console.log(`🚀  Server ready at ${url}`) // eslint-disable-line
})
