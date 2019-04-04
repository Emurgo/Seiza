import express from 'express'
import cors from 'cors'

import {getCachedApi} from './utils'

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

const getDummyServer = (port) => {
  const server = express()
  server.use(cors())

  server.get('/test1', (req, res) => {
    res.send('OK1')
  })

  server.get('/test2', (req, res) => {
    res.send('OK2')
  })

  return server.listen(port)
}

describe('Cache tests', () => {
  const PORT = 3008
  const DOMAIN = 'http://localhost'
  let server = null

  beforeEach(() => {
    server = getDummyServer(PORT)
  })

  afterEach(() => {
    server.close()
  })

  test('Cache second request', async () => {
    const api = getCachedApi({maxAge: 1000 * 10})

    const res1 = await api.get(`${DOMAIN}:${PORT}/test1`)
    expect(res1.request.fromCache).not.toBe(true)

    const res2 = await api.get(`${DOMAIN}:${PORT}/test1`)
    expect(res2.request.fromCache).toBe(true)
  })

  test('Dont cache after max age', async () => {
    const api = getCachedApi({maxAge: 1000 * 1})

    const res1 = await api.get(`${DOMAIN}:${PORT}/test1`)
    expect(res1.request.fromCache).not.toBe(true)

    await sleep(1500)

    const res2 = await api.get(`${DOMAIN}:${PORT}/test1`)
    expect(res2.request.fromCache).not.toBe(true)
  })

  test('Two endpoints cache', async () => {
    const api = getCachedApi({maxAge: 1000 * 10})

    const endpoint1Res1 = await api.get(`${DOMAIN}:${PORT}/test1`)
    expect(endpoint1Res1.request.fromCache).not.toBe(true)

    const endpoint2Res1 = await api.get(`${DOMAIN}:${PORT}/test2`)
    expect(endpoint2Res1.request.fromCache).not.toBe(true)

    const endpoint1Res2 = await api.get(`${DOMAIN}:${PORT}/test1`)
    expect(endpoint1Res2.request.fromCache).toBe(true)
    expect(endpoint1Res2.data).toBe('OK1')

    const endpoint2Res2 = await api.get(`${DOMAIN}:${PORT}/test2`)
    expect(endpoint2Res2.request.fromCache).toBe(true)
    expect(endpoint2Res2.data).toBe('OK2')
  })

  // TODO: tests for query params requests
  // TODO: tests for limit
})
