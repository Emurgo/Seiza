// @flow
import config from '../config'
import _ from 'lodash'

const BLOCKCHAIN_ROUTE = '/blockchain'
const STAKING_CENTER_ROUTE = '/staking'
const STAKING_POOLS_LIST_ROUTE = '/staking-pools'

// Note(ppershing)
// Do not return null here as it breaks flow at many places.
// Importantly, routeTo.something() && <Route/Link to={routeTo.something()} />
// would throw flow errors as flow cannot assume first call returns same value
// as the second :-(

// Instead, use '' as a null value,
// e.g. `featureOn ? 'some string' : ''`,
// or `featureOn && 'some string' || ''`
//

const HAVE_BLOCKCHAIN = true
const HAVE_STAKING_CENTER = config.showStakingData
const HAVE_STAKING_CENTER_LOCATION = config.showStakingLocationData
const HAVE_STAKING_CENTER_CHARTS = config.showStakingChartsData
const HAVE_STAKE_POOLS_LIST = config.showStakePoolsListData
const HAVE_LEGAL = true
const HAVE_MORE = config.showStakingData

const anyOfPaths = (paths: Array<?string>) => {
  const disjunction = paths.filter((p) => !!p).join('|')
  return disjunction ? `:path(${disjunction})` : null
}

const enableIf = (cond, value) => (cond ? value : '')

type _Ident = <T>(x: boolean, y: T) => T

const enableSectionIf: _Ident = (x, section) => {
  return _.mapValues(section, (fn) => (...args) => enableIf(x, fn(...args)))
}

// Note(bigamasta): Cannot put IS_YOROI into these conditions
// because if we disable to route, we still need to have it
// available in routeTo, so that we could open links in new window
export const routeTo = {
  home: () => '/',
  subscribeConfirmation: () => '/subscribe-confirmation',
  // staking key is under blockchain!
  blockchain: () => enableIf(HAVE_BLOCKCHAIN || HAVE_STAKING_CENTER, BLOCKCHAIN_ROUTE),
  ...enableSectionIf(HAVE_BLOCKCHAIN, {
    transaction: (txHash: string) => `${BLOCKCHAIN_ROUTE}/transaction/${txHash}`,
    block: (blockHash: string) => `${BLOCKCHAIN_ROUTE}/block/${blockHash}`,
    slot: (epoch: string, slot: string) => `${BLOCKCHAIN_ROUTE}/epoch/${epoch}/slot/${slot}`,
    address: (address58: string) => `${BLOCKCHAIN_ROUTE}/address/${address58}`,
    stakepool: (poolHash: string) => `${BLOCKCHAIN_ROUTE}/stakepool/${poolHash}`,
    stakingKey: (stakingKey: string) =>
      enableIf(HAVE_STAKING_CENTER, `${BLOCKCHAIN_ROUTE}/staking-key/${stakingKey}`),
    epoch: (epochNumber: number) =>
      enableIf(epochNumber != null, `${BLOCKCHAIN_ROUTE}/epoch/${epochNumber}`),
    searchResults: () => `${BLOCKCHAIN_ROUTE}/search-result`,
  }),
  more: () => enableIf(HAVE_MORE, '/more'),
  stakingCenter: enableSectionIf(HAVE_STAKING_CENTER, {
    home: () => STAKING_CENTER_ROUTE,
    poolList: () => `${STAKING_CENTER_ROUTE}/list`,
    poolComparison: () => `${STAKING_CENTER_ROUTE}/comparison`,
    history: () => `${STAKING_CENTER_ROUTE}/history`,
    charts: () => enableIf(HAVE_STAKING_CENTER_CHARTS, `${STAKING_CENTER_ROUTE}/charts`),
    location: () => enableIf(HAVE_STAKING_CENTER_LOCATION, `${STAKING_CENTER_ROUTE}/location`),
    people: () => `${STAKING_CENTER_ROUTE}/people`,
  }),
  stakingCenterSimple: () => enableIf(HAVE_STAKING_CENTER, '/staking-simple'),
  stakingPoolsList: () => enableIf(HAVE_STAKE_POOLS_LIST, STAKING_POOLS_LIST_ROUTE),
  // todo: refactor under legal key
  ...enableSectionIf(HAVE_LEGAL, {
    termsOfUse: () => '/terms',
    privacy: () => '/privacy',
  }),

  envOverrides: () => enableIf(config.envOverridesEnabled, '/__env__'),
  // Helper
  _anyOf: anyOfPaths,
}

export const combinedBlockchainPath = anyOfPaths([routeTo.blockchain(), routeTo.home()])
