// @flow

import idx from 'idx'
import gql from 'graphql-tag'
import {useQueryNotBugged} from '@/components/hooks/useQueryNotBugged'

export const useLoadSelectedPoolsData = (selectedPoolsHashes: Array<string>) => {
  const {loading, error, data} = useQueryNotBugged(
    gql`
      query($poolHashes: [String!]!) {
        stakePools(poolHashes: $poolHashes) {
          name
          poolHash
        }
      }
    `,
    {
      variables: {poolHashes: selectedPoolsHashes},
    }
  )
  // Note: not sorted intentionally
  const pools = idx(data, (_) => _.stakePools) || []
  return {loading, error, data: pools}
}
