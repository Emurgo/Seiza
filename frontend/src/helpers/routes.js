// @flow
const BLOCKCHAIN_ROUTE = '/blockchain'

export const routeTo = {
  home: () => '/',
  blockchain: () => BLOCKCHAIN_ROUTE,
  transaction: (txHash: string) => `${BLOCKCHAIN_ROUTE}/transaction/${txHash}`,
  block: (blockHash: string) => `${BLOCKCHAIN_ROUTE}/block/${blockHash}`,
  address: (address58: string) => `${BLOCKCHAIN_ROUTE}/address/${address58}`,
  stakepool: (poolHash: string) => `${BLOCKCHAIN_ROUTE}/stakepool/${poolHash}`,
  more: () => '/more',
  staking: () => '/staking',
  search: (query: string) => `${BLOCKCHAIN_ROUTE}/search/${query}`,
}
