const BLOCKCHAIN_ROUTE = '/blockchain'

export const routeTo = {
  home: () => '/',
  blockchain: () => BLOCKCHAIN_ROUTE,
  transaction: (txHash) => `${BLOCKCHAIN_ROUTE}/transaction/${txHash}`,
  block: (blockHash) => `${BLOCKCHAIN_ROUTE}/block/${blockHash}`,
  address: (address58) => `${BLOCKCHAIN_ROUTE}/address/${address58}`,
  more: () => '/more',
  staking: () => '/staking',
  search: (query) => `${BLOCKCHAIN_ROUTE}/search/${query}`,
}
