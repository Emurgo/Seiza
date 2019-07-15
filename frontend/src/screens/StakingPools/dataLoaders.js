// @flow
import gql from 'graphql-tag'
import idx from 'idx'
import {useQuery} from 'react-apollo-hooks'

export const useLoadStakePools = () => {
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

  return {
    error,
    loading,
    stakePools: idx(data, (_) => _.mockedStakePools) || [],
  }
}
