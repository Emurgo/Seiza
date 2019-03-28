const mockedAllTimeStakingInfo = {
  blocksCreated: 12333,
  blocksMissed: 2,
  totalPoolsCreated: 23,
}

const mockedPerEpochStakingInfo = {
  totalStakedAmount: '1234000000',
  poolsCount: 21,
  totalBlocksCreated: 400,
  totalBlocksMissed: 1,
  rewardsPerBlock: '4353',
}

export const fetchAllTimeStakingSummary = (api) => Promise.resolve(mockedAllTimeStakingInfo)

// TODO: check if epoch number is valid etc ...
export const fetchPerEpochStakingSummary = (api, epoch) =>
  Promise.resolve(mockedPerEpochStakingInfo)
