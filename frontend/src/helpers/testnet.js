// @flow

import config from '@/config'

type BlockchainNetworkConfig = {|
  label: string,
  url: string,
  isMainnet: boolean,
|}

export const blockchainNetworks: Array<BlockchainNetworkConfig> = config.instances.map(
  (instance, index) => ({...instance, isMainnet: index === 0})
)

const mainnet = blockchainNetworks.length > 0 ? blockchainNetworks[0] : {}

export const getBlockchainNetworkUrlWithQuery = (url: string, locale: string) =>
  `${url}?locale=${locale}`

export const getMainnetUrl = (locale: string): string => `${mainnet.url}?locale=${locale}`

export const getCurrentBlockchainNetwork = (origin: string): BlockchainNetworkConfig => {
  const networks = blockchainNetworks.filter((instance) => instance.url === origin)

  // Note: with assert it is hard to debug on heroku
  if (networks.length !== 1) {
    console.error('ORIGIN', origin) // eslint-disable-line
    console.error('NETWORKS', blockchainNetworks) // eslint-disable-line
    throw new Error('Invalid testnet setup')
  }

  return networks[0]
}
