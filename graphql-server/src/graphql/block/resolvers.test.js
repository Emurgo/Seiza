import 'babel-polyfill'

import {blocksResolver} from './resolvers'
import {facadeBlock} from './dataFacades'

// 'createBlock' shortcut
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

test('No `afterPosition` supplied, latest page is full', async () => {
  const latestPage = 100
  const pageOneData = [
    cb('20'),
    cb('19'),
    cb('18'),
    cb('17'),
    cb('16'),
    cb('15'),
    cb('14'),
    cb('13'),
    cb('12'),
    cb('11'),
  ]
  const pageTwoData = [
    cb('10'),
    cb('9'),
    cb('8'),
    cb('7'),
    cb('6'),
    cb('5'),
    cb('4'),
    cb('3'),
    cb('2'),
    cb('1'),
  ]
  const context = {
    cardanoAPI: mockApi({1: pageOneData, 2: pageTwoData}, latestPage)(),
  }
  const expectedOutput = {
    data: [
      cb('20'),
      cb('19'),
      cb('18'),
      cb('17'),
      cb('16'),
      cb('15'),
      cb('14'),
      cb('13'),
      cb('12'),
      cb('11'),
    ].map(facadeBlock),
    cursor: 990,
  }
  const output = await blocksResolver(null, {}, context)
  expect(output).toEqual(expectedOutput)
})

test('No `afterPosition` supplied, latest page is "half-full"(four items) ', async () => {
  const latestPage = 100

  const pageOneData = [cb('14'), cb('13'), cb('12'), cb('11')]
  const pageTwoData = [
    cb('10'),
    cb('9'),
    cb('8'),
    cb('7'),
    cb('6'),
    cb('5'),
    cb('4'),
    cb('3'),
    cb('2'),
    cb('1'),
  ]

  const context = {
    cardanoAPI: mockApi({1: pageOneData, 2: pageTwoData}, latestPage)(),
  }
  const expectedOutput = {
    data: [
      cb('14'),
      cb('13'),
      cb('12'),
      cb('11'),
      cb('10'),
      cb('9'),
      cb('8'),
      cb('7'),
      cb('6'),
      cb('5'),
    ].map(facadeBlock),
    cursor: 984,
  }
  const output = await blocksResolver(null, {}, context)
  expect(output).toEqual(expectedOutput)
})

test('No `afterPosition` supplied, latest page contains one item', async () => {
  const latestPage = 100

  const pageOneData = [cb('11')]
  const pageTwoData = [
    cb('10'),
    cb('9'),
    cb('8'),
    cb('7'),
    cb('6'),
    cb('5'),
    cb('4'),
    cb('3'),
    cb('2'),
    cb('1'),
  ]

  const context = {
    cardanoAPI: mockApi({1: pageOneData, 2: pageTwoData}, latestPage)(),
  }
  const expectedOutput = {
    data: [
      cb('11'),
      cb('10'),
      cb('9'),
      cb('8'),
      cb('7'),
      cb('6'),
      cb('5'),
      cb('4'),
      cb('3'),
      cb('2'),
    ].map(facadeBlock),
    cursor: 981,
  }
  const output = await blocksResolver(null, {}, context)
  expect(output).toEqual(expectedOutput)
})

test('`afterPosition` supplied, one item to be taken from page one', async () => {
  const afterPosition = 981
  const latestPage = 100

  const pageOneData = [
    cb('20'),
    cb('19'),
    cb('18'),
    cb('17'),
    cb('16'),
    cb('15'),
    cb('14'),
    cb('13'),
    cb('12'),
    cb('11'),
  ]
  const pageTwoData = [
    cb('10'),
    cb('9'),
    cb('8'),
    cb('7'),
    cb('6'),
    cb('5'),
    cb('4'),
    cb('3'),
    cb('2'),
    cb('1'),
  ]

  const context = {
    cardanoAPI: mockApi({1: pageOneData, 2: pageTwoData}, latestPage)(),
  }
  const expectedOutput = {
    data: [
      cb('11'),
      cb('10'),
      cb('9'),
      cb('8'),
      cb('7'),
      cb('6'),
      cb('5'),
      cb('4'),
      cb('3'),
      cb('2'),
    ].map(facadeBlock),
    cursor: 971,
  }
  const output = await blocksResolver(null, {afterPosition}, context)
  expect(output).toEqual(expectedOutput)
})

test('`afterPosition` four items to be taken from page one', async () => {
  const afterPosition = 984
  const latestPage = 100

  const pageOneData = [
    cb('20'),
    cb('19'),
    cb('18'),
    cb('17'),
    cb('16'),
    cb('15'),
    cb('14'),
    cb('13'),
    cb('12'),
    cb('11'),
  ]
  const pageTwoData = [
    cb('10'),
    cb('9'),
    cb('8'),
    cb('7'),
    cb('6'),
    cb('5'),
    cb('4'),
    cb('3'),
    cb('2'),
    cb('1'),
  ]

  const context = {
    cardanoAPI: mockApi({1: pageOneData, 2: pageTwoData}, latestPage)(),
  }
  const expectedOutput = {
    data: [
      cb('14'),
      cb('13'),
      cb('12'),
      cb('11'),
      cb('10'),
      cb('9'),
      cb('8'),
      cb('7'),
      cb('6'),
      cb('5'),
    ].map(facadeBlock),
    cursor: 974,
  }
  const output = await blocksResolver(null, {afterPosition}, context)
  expect(output).toEqual(expectedOutput)
})

test('`afterPosition` ten items to be taken from page one', async () => {
  const afterPosition = 990
  const latestPage = 100

  const pageOneData = [
    cb('20'),
    cb('19'),
    cb('18'),
    cb('17'),
    cb('16'),
    cb('15'),
    cb('14'),
    cb('13'),
    cb('12'),
    cb('11'),
  ]
  const pageTwoData = [
    cb('10'),
    cb('9'),
    cb('8'),
    cb('7'),
    cb('6'),
    cb('5'),
    cb('4'),
    cb('3'),
    cb('2'),
    cb('1'),
  ]

  const context = {
    cardanoAPI: mockApi({1: pageOneData, 2: pageTwoData}, latestPage)(),
  }
  const expectedOutput = {
    data: [
      cb('20'),
      cb('19'),
      cb('18'),
      cb('17'),
      cb('16'),
      cb('15'),
      cb('14'),
      cb('13'),
      cb('12'),
      cb('11'),
    ].map(facadeBlock),
    cursor: 980,
  }
  const output = await blocksResolver(null, {afterPosition}, context)
  expect(output).toEqual(expectedOutput)
})

test('Multiple calls, latest page was full', async () => {
  const latestPage = 100

  const pageOneData = [
    cb('40'),
    cb('39'),
    cb('38'),
    cb('37'),
    cb('36'),
    cb('35'),
    cb('34'),
    cb('33'),
    cb('32'),
    cb('31'),
  ]
  const pageTwoData = [
    cb('30'),
    cb('29'),
    cb('28'),
    cb('27'),
    cb('26'),
    cb('25'),
    cb('24'),
    cb('23'),
    cb('22'),
    cb('21'),
  ]
  const pageThreeData = [
    cb('20'),
    cb('19'),
    cb('18'),
    cb('17'),
    cb('16'),
    cb('15'),
    cb('14'),
    cb('13'),
    cb('12'),
    cb('11'),
  ]
  const pageFourData = [
    cb('10'),
    cb('9'),
    cb('8'),
    cb('7'),
    cb('6'),
    cb('5'),
    cb('4'),
    cb('3'),
    cb('2'),
    cb('1'),
  ]

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
    data: [
      cb('40'),
      cb('39'),
      cb('38'),
      cb('37'),
      cb('36'),
      cb('35'),
      cb('34'),
      cb('33'),
      cb('32'),
      cb('31'),
    ].map(facadeBlock),
    cursor: 990,
  }
  const output1 = await blocksResolver(null, {}, context)
  expect(output1).toEqual(expectedOutput1)

  const expectedOutput2 = {
    data: [
      cb('30'),
      cb('29'),
      cb('28'),
      cb('27'),
      cb('26'),
      cb('25'),
      cb('24'),
      cb('23'),
      cb('22'),
      cb('21'),
    ].map(facadeBlock),
    cursor: 980,
  }
  const output2 = await blocksResolver(null, {afterPosition: expectedOutput1.cursor}, context)
  expect(output2).toEqual(expectedOutput2)

  const expectedOutput3 = {
    data: [
      cb('20'),
      cb('19'),
      cb('18'),
      cb('17'),
      cb('16'),
      cb('15'),
      cb('14'),
      cb('13'),
      cb('12'),
      cb('11'),
    ].map(facadeBlock),
    cursor: 970,
  }
  const output3 = await blocksResolver(null, {afterPosition: expectedOutput2.cursor}, context)
  expect(output3).toEqual(expectedOutput3)
})

test('Multiple calls, latest page was not full', async () => {
  const latestPage = 100

  const pageOneData = [cb('34'), cb('33'), cb('32'), cb('31')]
  const pageTwoData = [
    cb('30'),
    cb('29'),
    cb('28'),
    cb('27'),
    cb('26'),
    cb('25'),
    cb('24'),
    cb('23'),
    cb('22'),
    cb('21'),
  ]
  const pageThreeData = [
    cb('20'),
    cb('19'),
    cb('18'),
    cb('17'),
    cb('16'),
    cb('15'),
    cb('14'),
    cb('13'),
    cb('12'),
    cb('11'),
  ]
  const pageFourData = [
    cb('10'),
    cb('9'),
    cb('8'),
    cb('7'),
    cb('6'),
    cb('5'),
    cb('4'),
    cb('3'),
    cb('2'),
    cb('1'),
  ]

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
    data: [
      cb('34'),
      cb('33'),
      cb('32'),
      cb('31'),
      cb('30'),
      cb('29'),
      cb('28'),
      cb('27'),
      cb('26'),
      cb('25'),
    ].map(facadeBlock),
    cursor: 984,
  }
  const output1 = await blocksResolver(null, {}, context)
  expect(output1).toEqual(expectedOutput1)

  const expectedOutput2 = {
    data: [
      cb('24'),
      cb('23'),
      cb('22'),
      cb('21'),
      cb('20'),
      cb('19'),
      cb('18'),
      cb('17'),
      cb('16'),
      cb('15'),
    ].map(facadeBlock),
    cursor: 974,
  }
  const output2 = await blocksResolver(null, {afterPosition: expectedOutput1.cursor}, context)
  expect(output2).toEqual(expectedOutput2)

  const expectedOutput3 = {
    data: [
      cb('14'),
      cb('13'),
      cb('12'),
      cb('11'),
      cb('10'),
      cb('9'),
      cb('8'),
      cb('7'),
      cb('6'),
      cb('5'),
    ].map(facadeBlock),
    cursor: 964,
  }
  const output3 = await blocksResolver(null, {afterPosition: expectedOutput2.cursor}, context)
  expect(output3).toEqual(expectedOutput3)
})
