// @flow

import gql from 'graphql-tag'
import idx from 'idx'
import {useQuery} from 'react-apollo-hooks'

import {useSelectedPoolsContext} from '../context/selectedPools'

export const useLoadSelectedPools = () => {
  const {selectedPools: poolHashes} = useSelectedPoolsContext()

  const {error, loading, data} = useQuery(
    gql`
      query($poolHashes: [String!]!) {
        stakePools(poolHashes: $poolHashes) {
          poolHash
          name
          createdAt
          description
          website
          summary {
            revenue
            performance
            adaStaked
            rewards
            keysDelegating
            fullness
            margins
            ownerPledge {
              actual
              declared
            }
          }
        }
      }
    `,
    {
      variables: {poolHashes},
    }
  )

  return {error, loading, data: idx(data, (_) => _.stakePools)}
}
