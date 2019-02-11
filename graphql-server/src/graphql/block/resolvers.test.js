import 'babel-polyfill'
import _ from 'lodash'

import {blocksResolver} from './resolvers'
import {facadeBlock} from './dataFacades'

const cb = (hash) => ({
  cbeEpoch: 100,
  cbeSlot: 12121,
  cbeBlkHash: hash,
  cbeTimeIssued: 1549645511,
  cbeTxNum: 1,
  cbeTotalSent: {
    getCoin: '434',
  },
  cbeSize: 1026,
  cbeBlockLead: '5411c7bf87c252609831a337a713e4859668cba7bba70a9c3ef7c398',
  cbeFees: {
    getCoin: '34',
  },
})

// Note: 'range' return half open interval
const cbs = (from, to) => _.range(from, to).map((item) => cb(item))

// TODO: consider mock strategy based on url and query string
const mockApi = (blockCount) => {
  return {
    get: (pathname, {page}) => {
      const PAGE_SIZE = 10
      page = page != null ? page : Math.ceil(blockCount / PAGE_SIZE)
      const result = [page, cbs(Math.min(page * PAGE_SIZE, blockCount), (page - 1) * PAGE_SIZE)]
      return Promise.resolve(result)
    },
  }
}

test('No `cursor` supplied, latest page is full', async () => {
  const context = {
    cardanoAPI: mockApi(1000),
  }
  const expectedOutput = {
    data: cbs(1000, 990).map(facadeBlock),
    cursor: 990,
  }
  const output = await blocksResolver(null, {}, context)
  expect(output).toEqual(expectedOutput)
})

test('No `cursor` supplied, latest page is "half-full"(four items) ', async () => {
  const context = {
    cardanoAPI: mockApi(994),
  }

  const expectedOutput = {
    data: cbs(994, 984).map(facadeBlock),
    cursor: 984,
  }
  const output = await blocksResolver(null, {}, context)
  expect(output).toEqual(expectedOutput)
})

test('No `cursor` supplied, latest page contains one item', async () => {
  const context = {
    cardanoAPI: mockApi(991),
  }
  const expectedOutput = {
    data: cbs(991, 981).map(facadeBlock),
    cursor: 981,
  }
  const output = await blocksResolver(null, {}, context)
  expect(output).toEqual(expectedOutput)
})

test('`cursor` supplied, one item to be taken from page one', async () => {
  const context = {
    cardanoAPI: mockApi(1000),
  }
  const cursor = 981

  const expectedOutput = {
    data: cbs(981, 971).map(facadeBlock),
    cursor: 971,
  }
  const output = await blocksResolver(null, {cursor}, context)
  expect(output).toEqual(expectedOutput)
})

test('`cursor` four items to be taken from page one', async () => {
  const cursor = 984

  const context = {
    cardanoAPI: mockApi(1000),
  }

  const expectedOutput = {
    data: cbs(984, 974).map(facadeBlock),
    cursor: 974,
  }
  const output = await blocksResolver(null, {cursor}, context)
  expect(output).toEqual(expectedOutput)
})

test('`cursor` ten items to be taken from page one', async () => {
  const cursor = 990

  const context = {
    cardanoAPI: mockApi(1000),
  }

  const expectedOutput = {
    data: cbs(990, 980).map(facadeBlock),
    cursor: 980,
  }
  const output = await blocksResolver(null, {cursor}, context)
  expect(output).toEqual(expectedOutput)
})

test('Multiple calls, latest page was full', async () => {
  const context = {
    cardanoAPI: mockApi(1000),
  }

  const expectedOutput1 = {
    data: cbs(1000, 990).map(facadeBlock),
    cursor: 990,
  }
  const output1 = await blocksResolver(null, {}, context)
  expect(output1).toEqual(expectedOutput1)

  const expectedOutput2 = {
    data: cbs(990, 980).map(facadeBlock),
    cursor: 980,
  }
  const output2 = await blocksResolver(null, {cursor: expectedOutput1.cursor}, context)
  expect(output2).toEqual(expectedOutput2)

  const expectedOutput3 = {
    data: cbs(980, 970).map(facadeBlock),
    cursor: 970,
  }
  const output3 = await blocksResolver(null, {cursor: expectedOutput2.cursor}, context)
  expect(output3).toEqual(expectedOutput3)
})

test('Multiple calls, latest page was not full', async () => {
  const context = {
    cardanoAPI: mockApi(994),
  }

  const expectedOutput1 = {
    data: cbs(994, 984).map(facadeBlock),
    cursor: 984,
  }
  const output1 = await blocksResolver(null, {}, context)
  expect(output1).toEqual(expectedOutput1)

  const expectedOutput2 = {
    data: cbs(984, 974).map(facadeBlock),
    cursor: 974,
  }
  const output2 = await blocksResolver(null, {cursor: expectedOutput1.cursor}, context)
  expect(output2).toEqual(expectedOutput2)

  const expectedOutput3 = {
    data: cbs(974, 964).map(facadeBlock),
    cursor: 964,
  }
  const output3 = await blocksResolver(null, {cursor: expectedOutput2.cursor}, context)
  expect(output3).toEqual(expectedOutput3)
})

test('Invalid cursor', async () => {
  const cursor = 0

  const context = {
    cardanoAPI: mockApi(1000),
  }

  const expectedOutput = {data: [], cursor: null}
  const output = await blocksResolver(null, {cursor}, context)
  expect(output).toEqual(expectedOutput)
})

test('End of pages', async () => {
  const context = {
    cardanoAPI: mockApi(4),
  }
  const expectedOutput = {
    data: cbs(4, 0).map(facadeBlock),
    cursor: null,
  }
  const output = await blocksResolver(null, {}, context)
  expect(output).toEqual(expectedOutput)
})
