export const routeTo = {
  home: () => '/',
  blockchain: () => '/blockchain',
  transaction: (txHash) => `/transaction/${txHash}`,
  address: (address58) => `/address/${address58}`,
  more: () => '/more',
  staking: () => '/staking',
}
