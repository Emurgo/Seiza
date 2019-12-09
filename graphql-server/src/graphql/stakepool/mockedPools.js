import _ from 'lodash'
import moment from 'moment'
import uuidv1 from 'uuid/v1'

const BYRON_MAINNET_START_TIME_SEC = 1506203091
const GENESIS_UNIX_TIMESTAMP_SEC = parseInt(
  process.env.GENESIS_UNIX_TIMESTAMP_SEC || BYRON_MAINNET_START_TIME_SEC,
  10
)

const BOOTSTRAP_TS = GENESIS_UNIX_TIMESTAMP_SEC * 1000

const genFloatInRange = (from, to) => from + Math.random() * (to - from)

const genIntInRange = (from, to) => Math.floor(genFloatInRange(from, to))

const ADA_DECIMALS = 1000000

const generatePool = (index) => ({
  poolHash: uuidv1(),
  name: `Lorem ${index}`,
  description: `Lorem ipsum ${index}`,
  createdAt: moment(BOOTSTRAP_TS + Math.floor(Math.random() * 1000000000)),
  website: 'https://www.cardano.org/en/home/',
  summary: {
    adaStaked: `${genIntInRange(0, 100000000 * ADA_DECIMALS)}`,
    keysDelegating: 100 + genIntInRange(0, 100),
    performance: 0.71 + genFloatInRange(-0.3, 0.2),
    rewards: `${genIntInRange(0, 100000 * ADA_DECIMALS)}`,
    cost: `${genIntInRange(0, 100000 * ADA_DECIMALS)}`,
    fullness: 0.6 + genFloatInRange(-0.3, 0.2),
    margins: 0.3 + genFloatInRange(-0.1, 0.1),
    revenue: 0.82 + genFloatInRange(-0.1, 0.1),
    stakersCount: 3 + genIntInRange(-2, 10),
    ownerPledge: {
      declared: '14243227',
      actual: '14243227',
    },
    profitabilityPosition: index + 1,
  },
})

export const MOCKED_STAKEPOOLS = _.range(0, 1000).map((i) => generatePool(i))

const mockedEstimatedRewards = {
  perYear: {
    percentage: 0.8232323,
    ada: '432543',
  },
  perMonth: {
    percentage: 0.2132323,
    ada: '4321',
  },
  perEpoch: {
    percentage: 0.1232323,
    ada: '432',
  },
}

const _BOOTSTRAP_POOLS = [
  {
    poolHash: '938d890d29f86128ec6864cfc6921d37f45cb3a477a348ef87b5c9b18c82a050',
    name: 'Bootstrap era pool #1',
    description: 'Pool 1 used before decentralization.',
    createdAt: moment(BOOTSTRAP_TS),
    website: 'https://www.cardano.org/en/home/',
    summary: {
      adaStaked: '141313510',
      keysDelegating: 100,
      performance: 0.71,
      rewards: '51355347',
      estimatedRewards: mockedEstimatedRewards,
      cost: '41345547',
      fullness: 0.6,
      margins: 0.3,
      revenue: 0.82,
      stakersCount: 3,
      profitabilityPosition: 1,
      ownerPledge: {
        declared: '14243227',
        actual: '14243227',
      },
    },
  },
  {
    poolHash: '740d890d29f86128ec6864cfc6921d37f45cb3a477a348ef87b5c9b18c82a050',
    name: 'Bootstrap era pool #2',
    description: 'Pool 2 used before decentralization',
    createdAt: moment(BOOTSTRAP_TS),
    website: 'https://www.cardano.org/en/home/',
    summary: {
      adaStaked: '141313520',
      keysDelegating: 99,
      performance: 0.72,
      rewards: '51355346',
      estimatedRewards: mockedEstimatedRewards,
      cost: '41345546',
      fullness: 0.67,
      margins: 0.31,
      revenue: 0.81,
      stakersCount: 4,
      profitabilityPosition: 2,
      ownerPledge: {
        declared: '14243226',
        actual: '14243326',
      },
    },
  },
  {
    poolHash: '310d890d29f86128ec6864cfc6921d37f45cb3a477a348ef87b5c9b18c82a050',
    name: 'Bootstrap era pool #3',
    description: 'Pool 3 used before decentralization',
    createdAt: moment(BOOTSTRAP_TS),
    website: 'https://www.cardano.org/en/home/',
    summary: {
      adaStaked: '141313530',
      keysDelegating: 98,
      performance: 0.73,
      rewards: '51355345',
      estimatedRewards: mockedEstimatedRewards,
      cost: '41345545',
      fullness: 0.66,
      margins: 0.32,
      revenue: 0.59,
      stakersCount: 5,
      profitabilityPosition: 3,
      ownerPledge: {
        declared: '14243225',
        actual: '14243228',
      },
    },
  },
  {
    poolHash: '120d890d29f86128ec6864cfc6921d37f45cb3a477a348ef87b5c9b18c82a050',
    name: 'Bootstrap era pool #4',
    description: 'Pool 4 used before decentralization',
    createdAt: moment(BOOTSTRAP_TS),
    website: 'https://www.cardano.org/en/home/',
    summary: {
      adaStaked: '141313540',
      keysDelegating: 97,
      performance: 0.74,
      rewards: '51355344',
      estimatedRewards: mockedEstimatedRewards,
      cost: '41345544',
      fullness: 0.65,
      margins: 0.33,
      revenue: 0.55,
      stakersCount: 6,
      profitabilityPosition: 4,
      ownerPledge: {
        declared: '14243224',
        actual: '14243224',
      },
    },
  },
  {
    poolHash: '123d890d29f86128ec6864cfc6921d37f45cb3a477a348ef87b5c9b18c82a050',
    name: 'Bootstrap era pool #5',
    description: 'Pool 5 used before decentralization',
    createdAt: moment(BOOTSTRAP_TS),
    website: 'https://www.cardano.org/en/home/',
    summary: {
      adaStaked: '141313550',
      keysDelegating: 96,
      performance: 0.75,
      rewards: '51355343',
      estimatedRewards: mockedEstimatedRewards,
      cost: '41345543',
      fullness: 0.64,
      margins: 0.34,
      revenue: 0.28,
      stakersCount: 7,
      profitabilityPosition: 5,
      ownerPledge: {
        declared: '14243223',
        actual: '15243223',
      },
    },
  },
  {
    poolHash: '654d890d29f86128ec6864cfc6921d37f45cb3a477a348ef87b5c9b18c82a050',
    name: 'Bootstrap era pool #6',
    description: 'Pool 6 used before decentralization',
    createdAt: moment(BOOTSTRAP_TS),
    website: 'https://www.cardano.org/en/home/',
    summary: {
      adaStaked: '141313560',
      keysDelegating: 95,
      performance: 0.76,
      rewards: '51355342',
      estimatedRewards: mockedEstimatedRewards,
      cost: '41345542',
      fullness: 0.63,
      margins: 0.35,
      revenue: 0.25,
      stakersCount: 8,
      profitabilityPosition: 6,
      ownerPledge: {
        declared: '14243222',
        actual: '13243222',
      },
    },
  },
  {
    poolHash: '737d890d29f86128ec6864cfc6921d37f45cb3a477a348ef87b5c9b18c82a050',
    name: 'Bootstrap era pool #7',
    description: 'Pool 7 used before decentralization',
    createdAt: moment(BOOTSTRAP_TS),
    website: 'https://www.cardano.org/en/home/',
    summary: {
      adaStaked: '141313570',
      keysDelegating: 94,
      performance: 0.77,
      rewards: '51355341',
      estimatedRewards: mockedEstimatedRewards,
      cost: '41345541',
      fullness: 0.62,
      margins: 0.36,
      revenue: 0.3,
      stakersCount: 9,
      profitabilityPosition: 7,
      ownerPledge: {
        declared: '14243221',
        actual: '15243221',
      },
    },
  },
]

export default _.fromPairs(_BOOTSTRAP_POOLS.map((pool) => [pool.poolHash, pool]))
