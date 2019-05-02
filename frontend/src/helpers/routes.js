// @flow
const BLOCKCHAIN_ROUTE = '/blockchain'
const STAKING_ROUTE = '/staking'
const STAKING_KEY_ROUTE = `${BLOCKCHAIN_ROUTE}/staking-key`

export const routeTo = {
  home: () => '/home',
  blockchain: () => BLOCKCHAIN_ROUTE,
  transaction: (txHash: string) => `${BLOCKCHAIN_ROUTE}/transaction/${txHash}`,
  block: (blockHash: string) => `${BLOCKCHAIN_ROUTE}/block/${blockHash}`,
  slot: (epoch: string, slot: string) => `${BLOCKCHAIN_ROUTE}/epoch/${epoch}/slot/${slot}`,
  address: (address58: string) => `${BLOCKCHAIN_ROUTE}/address/${address58}`,
  stakepool: (poolHash: string) => `${BLOCKCHAIN_ROUTE}/stakepool/${poolHash}`,
  epoch: (epochNumber: number) => `${BLOCKCHAIN_ROUTE}/epoch/${epochNumber}`,
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
  termsOfUse: () => '/terms',
  subscribe: () => '/subscribe',
}
