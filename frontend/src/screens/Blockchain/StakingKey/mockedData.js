const generateStakePool = (stakingKeyHash) => ({
  hash: stakingKeyHash,
  name: 'Warren Buffett and Friend’s Stake Pool',
  validationCharacters: 'c0fe2f75',
  createdAt: '2019-02-13T10:58:31.000Z',
  webpage: 'https://www.warrenbuffettstakepool.com',
  pledge: '10000003723742',
  totalAdaStaked: '10000003723742',
  performance: 0.65,
  totalRewards: {
    amount: '5000000123123',
    estimatedMissed: '1000000123123',
  },
  timeActive: {
    epochs: 32,
    days: 500,
  },
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
  history: [
    {
      epochNumber: 103,
      actions: [
        {
          type: 'COST',
          value: '500000000',
        },
        {
          type: 'MARGIN',
          total: -0.05,
          change: -0.03,
        },
      ],
    },
    {
      epochNumber: 102,
      actions: [
        {
          type: 'PLEDGE_CHANGE',
          value: '1000000000',
        },
        {
          type: 'WITHDRAWAL',
          value: '-300000000',
        },
      ],
    },
    {
      epochNumber: 101,
      actions: [
        {
          type: 'COST',
          value: '500000000',
        },
        {
          type: 'WITHDRAWAL',
          value: '-300000000',
        },
        {
          type: 'MARGIN',
          total: -0.05,
          change: -0.03,
        },
      ],
    },
  ],
  transactions: [
    {
      txHash: '40c0139a96635c09c224765add076dcc5a51a30bb126b37dcfa16b0e99b92240',
      epochNumber: 30,
      slot: 34,
      date: '2019-02-13T10:58:31.000Z',
      action: {
        type: 'CREATED',
        value: {
          depositAmount: '1000000123456',
        },
      },
    },
    {
      txHash: '48721e871cde8a5ba1815bb425a6ace8359b6eb56b7a8be3fb025395b8a11682',
      epochNumber: 30,
      slot: 1030,
      date: '2019-02-13T10:58:31.000Z',
      action: {
        type: 'DELETED',
        value: {
          refundAmount: '1000000123456',
        },
      },
    },
    {
      txHash: '6aed704e4f22db63fe20311be32d63804fec36e3ed0ee189f34ca36e21865cfd',
      epochNumber: 34,
      slot: 911,
      date: '2019-02-13T10:58:31.000Z',
      action: {
        type: 'DELEGATES',
        value: {
          poolHash: 'a711bc58750f204899e49d565a96ad5ce0e8d85ab20309eae46b86882141fb0d',
          poolName: 'Warren Buffett and Friend’s Stake Pool',
        },
      },
    },
    {
      txHash: '1551aef38e78d3c06f00fa6dda81affccef0aea25bfdcdc16e2921e87ce8149c',
      epochNumber: 49,
      slot: 2,
      date: '2019-02-13T10:58:31.000Z',
      action: {
        type: 'FUNDS',
        value: {
          poolHash: 'a711bc58750f204899e49d565a96ad5ce0e8d85ab20309eae46b86882141fb0d',
          poolName: 'Warren Buffett and Friend’s Stake Pool',
        },
      },
    },
    {
      txHash: 'c6f2551f6d4b3a83dc8a63571e8a589fe7bb327ffa7a2da2bd61b601648bc41a',
      epochNumber: 51,
      slot: 431,
      date: '2019-02-13T10:58:31.000Z',
      action: {
        type: 'FUNDED_BY',
        value: {
          poolHash: 'a711bc58750f204899e49d565a96ad5ce0e8d85ab20309eae46b86882141fb0d',
          poolName: 'Warren Buffett and Friend’s Stake Pool',
        },
      },
    },
    {
      txHash: '342b626ab61b5b2fc88b80284a444dc76485bfc6765d6b45f7ef7d9cf24d29dc',
      epochNumber: 57,
      slot: 625,
      date: '2019-02-13T10:58:31.000Z',
      action: {
        type: 'WITHDRAWAL',
        value: {
          inputAmount: '1000000123456',
        },
      },
    },
    {
      txHash: 'f1a3951e1b0ae18143554282e4cff7e716dce763bd20bc7b5bc1a70db2a67a73',
      epochNumber: 58,
      slot: 72,
      date: '2019-02-13T10:58:31.000Z',
      action: {
        type: 'REWARD',
        value: {
          rewardAmount: '1000000123456',
        },
      },
    },
    {
      txHash: '4447e13926b5a00e2802aad2db0ae7d9f0d7072d675c82589b840a2780908be6',
      epochNumber: 59,
      slot: 1111,
      date: '2019-02-13T10:58:31.000Z',
      action: {
        type: 'FUNDING_POOL_REMOVED',
        value: {
          poolHash: 'a711bc58750f204899e49d565a96ad5ce0e8d85ab20309eae46b86882141fb0d',
          poolName: 'Warren Buffett and Friend’s Stake Pool',
        },
      },
    },
  ],
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
