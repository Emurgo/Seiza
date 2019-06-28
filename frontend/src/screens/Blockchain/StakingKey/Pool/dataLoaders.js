// @flow
import {getStakePoolStakingKey} from '../mockedData'

// TODO: get data from backend
export const useLoadStakepoolData = (stakepoolHash: string) => ({
  error: false,
  loading: false,
  data: getStakePoolStakingKey(stakepoolHash),
})
