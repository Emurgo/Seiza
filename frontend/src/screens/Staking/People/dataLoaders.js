// @flow

import gql from 'graphql-tag'
import {useQuery} from 'react-apollo-hooks'

import {useSelectedPoolsContext} from '../context/selectedPools'

// TODO: probably will be part of stake pool
const mockedOwners = [
  {
    stakingKey: 'c4ca4238a0b923820dcc509a6f75849bc81e728d9d4c2f636f067f89cc14862a',
    pledge: '34354354354354354',
  },
  {
    stakingKey: 'c4ca4238a0b923820dcc509a6f75849bc81e728d9d4c2f636f067f89cc14862b',
    pledge: '4354354354354354',
  },
  {
    stakingKey: 'c4ca4238a0b923820dcc509a6f75849bc81e728d9d4c2f636f067f89cc14862c',
    pledge: '354354354354354',
  },
]

export const useLoadSelectedPoolsData = () => {
  const {selectedPools: poolHashes} = useSelectedPoolsContext()
  const {error, loading, data} = useQuery(
    gql`
      query($poolHashes: [String!]!) {
        stakePools(poolHashes: $poolHashes) {
          poolHash
          name
          summary {
            adaStaked
            stakersCount
            averageUserStaking
            usersAdaStaked
            ownerPledge {
              declared
              actual
            }
          }
        }
      }
    `,
    {
      variables: {poolHashes},
    }
  )

  const stakePools = (data.stakePools || []).map((pool) => ({...pool, owners: mockedOwners}))
  return {data: stakePools, loading, error}
}
