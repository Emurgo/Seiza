export const routeTo = {
  home: () => '/',
  blockchain: () => '/blockchain',
  transaction: (txHash) => `/transaction/${txHash}`,
  block: (blockHash) => `/block/${blockHash}`,
  address: (address58) => `/address/${address58}`,
  more: () => '/more',
  staking: () => '/staking',
}
