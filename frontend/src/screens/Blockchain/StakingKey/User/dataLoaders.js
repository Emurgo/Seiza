// @flow
import {getUserStakingKey} from '../mockedData'

// TODO: get data from backend
export const useLoadStakingKeyData = (stakingKeyHash: string) => ({
  error: false,
  loading: false,
  data: getUserStakingKey(stakingKeyHash),
})
