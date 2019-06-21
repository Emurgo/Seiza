const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
// project location (where pages/ directory lives) is ./src
const app = next({dev, dir: './src'})

app.prepare().then(() => {
  const server = express()

  server.get('*', (req, res) => {
    return app.render(req, res, '/', req.query)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
