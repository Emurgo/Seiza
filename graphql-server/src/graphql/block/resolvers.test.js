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
const mockApi = (responses, latestPage) => () => {
  let apiCallOrder = 1
  return {
    get: (pathname) => {
      const result = [latestPage, responses[apiCallOrder]]
      apiCallOrder += 1
      return Promise.resolve(result)
    },
  }
}

test('No `cursor` supplied, latest page is full', async () => {
  const latestPage = 100
  const pageOneData = cbs(20, 10)
  const pageTwoData = cbs(10, 0)
  const context = {
    cardanoAPI: mockApi({1: pageOneData, 2: pageTwoData}, latestPage)(),
  }
  const expectedOutput = {
    data: cbs(20, 10).map(facadeBlock),
    cursor: 990,
  }
  const output = await blocksResolver(null, {}, context)
  expect(output).toEqual(expectedOutput)
})

test('No `cursor` supplied, latest page is "half-full"(four items) ', async () => {
  const latestPage = 100

  const pageOneData = cbs(14, 10)
  const pageTwoData = cbs(10, 0)

  const context = {
    cardanoAPI: mockApi({1: pageOneData, 2: pageTwoData}, latestPage)(),
  }
  const expectedOutput = {
    data: cbs(14, 4).map(facadeBlock),
    cursor: 984,
  }
  const output = await blocksResolver(null, {}, context)
  expect(output).toEqual(expectedOutput)
})

test('No `cursor` supplied, latest page contains one item', async () => {
  const latestPage = 100

  const pageOneData = cbs(11, 10)
  const pageTwoData = cbs(10, 0)

  const context = {
    cardanoAPI: mockApi({1: pageOneData, 2: pageTwoData}, latestPage)(),
  }
  const expectedOutput = {
    data: cbs(11, 1).map(facadeBlock),
    cursor: 981,
  }
  const output = await blocksResolver(null, {}, context)
  expect(output).toEqual(expectedOutput)
})

test('`cursor` supplied, one item to be taken from page one', async () => {
  const cursor = 981
  const latestPage = 100

  const pageOneData = cbs(20, 10)
  const pageTwoData = cbs(10, 0)

  const context = {
    cardanoAPI: mockApi({1: pageOneData, 2: pageTwoData}, latestPage)(),
  }
  const expectedOutput = {
    data: cbs(11, 1).map(facadeBlock),
    cursor: 971,
  }
  const output = await blocksResolver(null, {cursor}, context)
  expect(output).toEqual(expectedOutput)
})

test('`cursor` four items to be taken from page one', async () => {
  const cursor = 984
  const latestPage = 100

  const pageOneData = cbs(20, 10)
  const pageTwoData = cbs(10, 0)

  const context = {
    cardanoAPI: mockApi({1: pageOneData, 2: pageTwoData}, latestPage)(),
  }
  const expectedOutput = {
    data: cbs(14, 4).map(facadeBlock),
    cursor: 974,
  }
  const output = await blocksResolver(null, {cursor}, context)
  expect(output).toEqual(expectedOutput)
})

test('`cursor` ten items to be taken from page one', async () => {
  const cursor = 990
  const latestPage = 100

  const pageOneData = cbs(20, 10)
  const pageTwoData = cbs(10, 0)

  const context = {
    cardanoAPI: mockApi({1: pageOneData, 2: pageTwoData}, latestPage)(),
  }
  const expectedOutput = {
    data: cbs(20, 10).map(facadeBlock),
    cursor: 980,
  }
  const output = await blocksResolver(null, {cursor}, context)
  expect(output).toEqual(expectedOutput)
})

test('Multiple calls, latest page was full', async () => {
  const latestPage = 100

  const pageOneData = cbs(40, 30)
  const pageTwoData = cbs(30, 20)
  const pageThreeData = cbs(20, 10)
  const pageFourData = cbs(10, 0)

  const context = {
    cardanoAPI: mockApi(
      {
        1: pageOneData,
        2: pageTwoData,
        3: pageTwoData,
        4: pageThreeData,
        5: pageThreeData,
        6: pageFourData,
      },
      latestPage
    )(),
  }
  const expectedOutput1 = {
    data: cbs(40, 30).map(facadeBlock),
    cursor: 990,
  }
  const output1 = await blocksResolver(null, {}, context)
  expect(output1).toEqual(expectedOutput1)

  const expectedOutput2 = {
    data: cbs(30, 20).map(facadeBlock),
    cursor: 980,
  }
  const output2 = await blocksResolver(null, {cursor: expectedOutput1.cursor}, context)
  expect(output2).toEqual(expectedOutput2)

  const expectedOutput3 = {
    data: cbs(20, 10).map(facadeBlock),
    cursor: 970,
  }
  const output3 = await blocksResolver(null, {cursor: expectedOutput2.cursor}, context)
  expect(output3).toEqual(expectedOutput3)
})

test('Multiple calls, latest page was not full', async () => {
  const latestPage = 100

  const pageOneData = cbs(34, 30)
  const pageTwoData = cbs(30, 20)
  const pageThreeData = cbs(20, 10)
  const pageFourData = cbs(10, 0)

  const context = {
    cardanoAPI: mockApi(
      {
        1: pageOneData,
        2: pageTwoData,
        3: pageTwoData,
        4: pageThreeData,
        5: pageThreeData,
        6: pageFourData,
      },
      latestPage
    )(),
  }
  const expectedOutput1 = {
    data: cbs(34, 24).map(facadeBlock),
    cursor: 984,
  }
  const output1 = await blocksResolver(null, {}, context)
  expect(output1).toEqual(expectedOutput1)

  const expectedOutput2 = {
    data: cbs(24, 14).map(facadeBlock),
    cursor: 974,
  }
  const output2 = await blocksResolver(null, {cursor: expectedOutput1.cursor}, context)
  expect(output2).toEqual(expectedOutput2)

  const expectedOutput3 = {
    data: cbs(14, 4).map(facadeBlock),
    cursor: 964,
  }
  const output3 = await blocksResolver(null, {cursor: expectedOutput2.cursor}, context)
  expect(output3).toEqual(expectedOutput3)
})
