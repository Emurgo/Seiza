export const routeTo = {
  home: () => '/',
  blockchain: () => '/blockchain',
  transaction: (id) => `/transaction/${id}`,
  address: (id) => `/address/${id}`,
  more: () => '/more',
  staking: () => '/staking',
}
