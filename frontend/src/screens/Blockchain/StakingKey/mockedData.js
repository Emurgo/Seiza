const generateStakePool = (stakingKeyHash) => ({
  hash: stakingKeyHash,
  name: 'Warren Buffett and Friend’s Stake Pool',
  validationCharacters: 'c0fe2f75',
  createdAt: '2019-02-13T10:58:31.000Z',
  webpage: 'https://www.warrenbuffettstakepool.com',
  pledge: '10000003723742',
  totalAdaStaked: '10000003723742',
  performance: 0.65,
  totalRewards: '5000000123123',
  totalActiveEpochs: 32,
  stakersCount: 1271,
  currentMargin: {
    margin: 0.08,
    updatedAt: '2019-02-13T10:58:31.000Z',
  },
  currentCost: {
    cost: '500000000',
    updatedAt: '2019-02-13T10:58:31.000Z',
  },
  topPoolComparison: {
    position: 2,
    margin: 0.03,
    cost: '-100000000',
    fullness: -0.1,
    revenue: -0.05,
    performance: -0.01,
    topPool: {
      name: "Den's Stake Pool",
      hash: '64ec982b88d2b75e6163b86ef1dc8f8f09b7481dd625c987f1ba240c6aed3567',
    },
  },
  fullness: 0.8,
  revenue: 0.85,
  description: 'let’s work together to make money!',
  rewardsAddress: 'a5c3af824de94faff971d1b2488c5017dcf0f3c3a056334195efb368c0fe2f75',
  stakePoolCertificate: '6b686ed997b3846ebf93642b5bfe482ca2682245b826601ca352d2c3c0394a68',
})

export const getUserStakingKey = (stakingKeyHash) => ({
  hash: stakingKeyHash,
  type: 'USER',
  createdAt: '2019-02-13T10:58:31.000Z',
  stakedAda: '151251251981295151',
  totalRewards: '41513514846517',
  uncollectedRewards: '9439918145817',
  addressesCount: 5134,
  totalEpochsActive: 11,
  rewardAddress: 'a5c3af824de94faff971d1b2488c5017dcf0f3c3a056334195efb368c0fe2f75',
  delegationCert: '6b686ed997b3846ebf93642b5bfe482ca2682245b826601ca352d2c3c0394a68',
  epochsInCurrentStakePool: 3,
  currentStakePool: generateStakePool(
    'dd4548f88bebd98653a6977cb6cf1cf6a57dcec8ed8655f6e8b690e998bb2164'
  ),
})
export const getStakePoolStakingKey = (stakingKeyHash) => {
  return generateStakePool(stakingKeyHash)
}
