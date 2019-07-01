// @flow
import gql from 'graphql-tag'
import idx from 'idx'
import {useQuery} from 'react-apollo-hooks'

import {useSelectedPoolsContext} from '../context/selectedPools'

import {getMockedHistory} from './mockedData'

// TOOD: Dont we already have hook/dataProvider that we can reuse
// current epoch from?
// TODO: should not current epoch/block be stored in global context?
export const useLoadCurrentEpoch = () => {
  const {error, loading, data} = useQuery(
    gql`
      query {
        currentStatus {
          latestBlock {
            epoch
          }
        }
      }
    `
  )

  return {
    error,
    loading,
    currentEpoch: idx(data, (_) => _.currentStatus.latestBlock.epoch),
  }
}

export const useLoadSelectedPoolsData = () => {
  const {selectedPools: poolHashes} = useSelectedPoolsContext()
  const {loading, error, data} = useQuery(
    gql`
      query($poolHashes: [String!]!) {
        stakePools(poolHashes: $poolHashes) {
          name
          poolHash
        }
      }
    `,
    {
      variables: {poolHashes},
    }
  )
  return {loading, error, data: idx(data, (_) => _.stakePools)}
}

export const useLoadPoolsHistory = (poolHashes: Array<string>, toEpoch: number) => ({
  error: false,
  loading: false,
  data: getMockedHistory(poolHashes, toEpoch),
})