// @flow
import {getStakingKey, getStakingKeyHistory} from '@/screens/Blockchain/common/mockedStakingData'

// TODO: get data from backend
export const useLoadStakingKeyData = (stakingKeyHash: string) => ({
  error: false,
  loading: false,
  data: getStakingKey(stakingKeyHash),
})

export const useLoadStakingKeyHistory = (stakingKeyHash: string) => ({
  error: false,
  loading: false,
  data: getStakingKeyHistory(stakingKeyHash),
})
