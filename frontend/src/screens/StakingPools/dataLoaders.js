// @flow
import _ from 'lodash'
import gql from 'graphql-tag'
import idx from 'idx'
import {useQuery} from 'react-apollo-hooks'
import {useMemo} from 'react'

type Order = 'asc' | 'desc'

export const useLoadStakepools = (sortBy: string, order: Order) => {
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
  const flattenPools = useMemo(() => stakepools.map((pool) => ({...pool, ...pool.summary})), [
    stakepools,
  ])

  const sortedPools = useMemo(() => _.orderBy(flattenPools, (d) => d[sortBy], [order]), [
    flattenPools,
    order,
    sortBy,
  ])

  return {
    error,
    loading,
    stakepools: sortedPools,
  }
}
