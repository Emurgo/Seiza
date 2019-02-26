// @flow
const BLOCKCHAIN_ROUTE = '/blockchain'
const STAKING_ROUTE = '/staking'

export const routeTo = {
  home: () => '/',
  blockchain: () => BLOCKCHAIN_ROUTE,
  transaction: (txHash: string) => `${BLOCKCHAIN_ROUTE}/transaction/${txHash}`,
  block: (blockHash: string) => `${BLOCKCHAIN_ROUTE}/block/${blockHash}`,
  address: (address58: string) => `${BLOCKCHAIN_ROUTE}/address/${address58}`,
  stakepool: (poolHash: string) => `${BLOCKCHAIN_ROUTE}/stakepool/${poolHash}`,
  more: () => '/more',
  staking: {
    home: () => STAKING_ROUTE,
    poolList: () => `${STAKING_ROUTE}/list`,
    poolComparison: () => `${STAKING_ROUTE}/comparison`,
    history: () => `${STAKING_ROUTE}/history`,
    charts: () => `${STAKING_ROUTE}/charts`,
    location: () => `${STAKING_ROUTE}/location`,
  },
  search: (query: string) => `${BLOCKCHAIN_ROUTE}/search/${query}`,
}
