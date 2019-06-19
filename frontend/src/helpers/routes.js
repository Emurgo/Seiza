// @flow
import config from '../config'
import _ from 'lodash'

const BLOCKCHAIN_ROUTE = '/blockchain'
const STAKING_ROUTE = '/staking'
const STAKING_KEY_ROUTE = `${BLOCKCHAIN_ROUTE}/staking-key`

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
const HAVE_STAKING = config.showStakingData
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

export const routeTo = {
  home: () => '/home',
  // staking key is under blockchain!
  // FIXME: how to deal with this in Yoroi where we want staking but don't want
  // blockchain section?
  blockchain: () => enableIf(HAVE_BLOCKCHAIN || HAVE_STAKING, BLOCKCHAIN_ROUTE),
  ...enableSectionIf(HAVE_BLOCKCHAIN, {
    transaction: (txHash: string) => `${BLOCKCHAIN_ROUTE}/transaction/${txHash}`,
    block: (blockHash: string) => `${BLOCKCHAIN_ROUTE}/block/${blockHash}`,
    slot: (epoch: string, slot: string) => `${BLOCKCHAIN_ROUTE}/epoch/${epoch}/slot/${slot}`,
    address: (address58: string) => `${BLOCKCHAIN_ROUTE}/address/${address58}`,
    stakepool: (poolHash: string) => `${BLOCKCHAIN_ROUTE}/stakepool/${poolHash}`,
    epoch: (epochNumber: number) =>
      enableIf(epochNumber != null, `${BLOCKCHAIN_ROUTE}/epoch/${epochNumber}`),
    searchResults: () => `${BLOCKCHAIN_ROUTE}/search-result`,
  }),
  more: () => enableIf(HAVE_MORE, '/more'),
  stakingKey: enableSectionIf(HAVE_STAKING, {
    home: (stakingKey: string) => `${STAKING_KEY_ROUTE}/${stakingKey}`,
    user: (stakingKey: string) => `${STAKING_KEY_ROUTE}/${stakingKey}/user`,
    // FIXME: how is this different from blockchain/stakepool?
    stakePool: (stakingKey: string) => `${STAKING_KEY_ROUTE}/${stakingKey}/pool`,
  }),
  staking: enableSectionIf(HAVE_STAKING, {
    home: () => STAKING_ROUTE,
    poolList: () => `${STAKING_ROUTE}/list`,
    poolComparison: () => `${STAKING_ROUTE}/comparison`,
    history: () => `${STAKING_ROUTE}/history`,
    charts: () => `${STAKING_ROUTE}/charts`,
    location: () => `${STAKING_ROUTE}/location`,
    people: () => `${STAKING_ROUTE}/people`,
  }),
  // todo: refactor under legal key
  ...enableSectionIf(HAVE_LEGAL, {
    termsOfUse: () => '/terms',
    privacy: () => '/privacy',
  }),

  envOverrides: () => enableIf(!config.isProduction, '/__env__'),
  // Helper
  _anyOf: anyOfPaths,
}
