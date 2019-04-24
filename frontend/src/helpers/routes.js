// @flow
import {ObjectValues} from '@/helpers/flow'
const STAKING_ROUTE = '/staking'

// TODO: should this be added to blockchain routes?
const STAKING_KEY_ROUTE = '/staking-key'

const BLOCKCHAIN_ROUTES = {
  SLOT: {
    doesMatch: (pathname) => pathname.match(/^\/epoch\/([^/]*)\/slot\/([^/]*)$/),
    routeTo: (epoch: string, slot: string) => `/epoch/${epoch}/slot/${slot}`,
  },
  BLOCK: {
    doesMatch: (pathname) => pathname.match(/^\/block\/([^/]*)$/),
    routeTo: (blockHash: string) => `/block/${blockHash}`,
  },
  BLOCKS: {
    doesMatch: (pathname) => pathname.match(/^\/blocks$/),
    routeTo: () => '/blocks',
  },
  EPOCH: {
    doesMatch: (pathname) => pathname.match(/^\/epoch\/([^/]*)$/),
    routeTo: (epochNumber: number) => `/epoch/${epochNumber}`,
  },
  TRANSACTION: {
    doesMatch: (pathname) => pathname.match(/^\/transaction\/([^/]*)$/),
    routeTo: (txHash: string) => `/transaction/${txHash}`,
  },
  ADDRESS: {
    doesMatch: (pathname) => pathname.match(/^\/address\/([^/]*)$/),
    routeTo: (address58: string) => `/address/${address58}`,
  },
  STAKE_POOL: {
    doesMatch: (pathname) => pathname.match(/^\/stakepool\/([^/]*)$/),
    routeTo: (poolHash: string) => `/stakepool/${poolHash}`,
  },
}

export const isBlockchainTabActive = (pathname: string) => {
  return ObjectValues(BLOCKCHAIN_ROUTES).some(({doesMatch}) => doesMatch(pathname))
}

export const routeTo = {
  home: () => '/home',
  blockchain: BLOCKCHAIN_ROUTES.BLOCKS.routeTo,
  transaction: BLOCKCHAIN_ROUTES.TRANSACTION.routeTo,
  block: BLOCKCHAIN_ROUTES.BLOCK.routeTo,
  slot: BLOCKCHAIN_ROUTES.SLOT.routeTo,
  address: BLOCKCHAIN_ROUTES.ADDRESS.routeTo,
  stakepool: BLOCKCHAIN_ROUTES.STAKE_POOL.routeTo,
  epoch: BLOCKCHAIN_ROUTES.EPOCH.routeTo,
  more: () => '/more',
  stakingKey: {
    home: (stakingKey: string) => `${STAKING_KEY_ROUTE}/${stakingKey}`,
    user: (stakingKey: string) => `${STAKING_KEY_ROUTE}/${stakingKey}/user`,
    stakePool: (stakingKey: string) => `${STAKING_KEY_ROUTE}/${stakingKey}/pool`,
  },
  staking: {
    home: () => STAKING_ROUTE,
    poolList: () => `${STAKING_ROUTE}/list`,
    poolComparison: () => `${STAKING_ROUTE}/comparison`,
    history: () => `${STAKING_ROUTE}/history`,
    charts: () => `${STAKING_ROUTE}/charts`,
    location: () => `${STAKING_ROUTE}/location`,
    people: () => `${STAKING_ROUTE}/people`,
  },
}
