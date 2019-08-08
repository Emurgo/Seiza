// @flow
import gql from 'graphql-tag'
import idx from 'idx'
import {useQuery} from 'react-apollo-hooks'
import {useMemo} from 'react'

export const useLoadStakepools = () => {
  const {error, loading, data} = useQuery(
    gql`
      query {
        mockedStakePools {
          poolHash
          createdAt
          description
          name
          summary {
            margins
            performance
            adaStaked
            rewards
            keysDelegating
            fullness
            revenue
            stakersCount
          }
        }
      }
    `
  )

  const stakepools = idx(data, (_) => _.mockedStakePools) || []
  const flattenPools = useMemo(() => stakepools.map<{}>((pool) => ({...pool, ...pool.summary})), [
    stakepools,
  ])

  return {
    error,
    loading,
    stakepools: flattenPools,
  }
}
