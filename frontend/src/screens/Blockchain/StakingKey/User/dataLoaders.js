// @flow
import {getStakingKey, getStakingKeyHistory} from '../mockedData'

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
