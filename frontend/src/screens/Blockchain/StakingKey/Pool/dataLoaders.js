// @flow
import {getStakepool, getStakepoolHistory} from '../mockedData'

// TODO: get data from backend
export const useLoadStakepoolData = (stakepoolHash: string) => ({
  error: false,
  loading: false,
  data: getStakepool(stakepoolHash),
})

export const useLoadStakepoolHistory = (stakingKeyHash: string) => ({
  error: false,
  loading: false,
  data: getStakepoolHistory(stakingKeyHash),
})
