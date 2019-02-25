// @flow
import moment from 'moment'
type Summary = {
  slotCount: number,
  blocksCreated: number,
  transactionCount: number,
  totalAdaSupply: string,
  epochFees: string,
  totalAdaStaked: string,
  stakingRewards: string,
  delegatingStakingKeysCount: number,
  activeStakingPoolCount: number,
}
type Epoch = {
  startTime: Object,
  endTime: Object,
  progress: number,
  summary: Summary,
}
const mockedEpoch: Epoch = {
  startTime: moment(new Date()),
  endTime: moment(new Date()),
  progress: 1,
  summary: {
    slotCount: 21600,
    blocksCreated: 15721,
    transactionCount: 141299,
    totalAdaSupply: '31112483745',
    epochFees: '5107742678913399',
    totalAdaStaked: '2828407613181818',
    stakingRewards: '700000000',
    delegatingStakingKeysCount: 1828123,
    activeStakingPoolCount: 45,
  },
}

export const fetchEpoch = (epochNumber: number): Promise<Epoch> => {
  return Promise.resolve(mockedEpoch)
}
