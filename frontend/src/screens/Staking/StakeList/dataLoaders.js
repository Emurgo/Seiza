// @flow

import gql from 'graphql-tag'
import {useCallback} from 'react'
import {useQuery} from 'react-apollo-hooks'

import {usePerformanceContext} from '../context/performance'
import {useSearchTextContext} from '../context/searchText'
import {useSortByContext} from '../context/sortBy'
import {useUserAdaContext} from '../context/userAda'

const PAGE_SIZE = 10

const formatPerformancetoGQL = (performance) => ({
  from: performance[0] / 100,
  to: performance[1] / 100,
})

export const useLoadPagedStakePoolList = () => {
  const {sortBy} = useSortByContext()
  const {performance} = usePerformanceContext()
  const {searchText} = useSearchTextContext()
  const {userAda} = useUserAdaContext()
  const cursor = null

  const {
    loading,
    error,
    data: {pagedStakePoolList},
    fetchMore,
  } = useQuery(
    gql`
      query($cursor: String, $pageSize: Int, $searchOptions: StakePoolSearchOptions!) {
        pagedStakePoolList(cursor: $cursor, pageSize: $pageSize, searchOptions: $searchOptions) {
          stakePools {
            poolHash
            description
            name
            createdAt
            age
            summary {
              cost
              adaStaked
              fullness
              margins
              performance
              adaStaked
              profitabilityPosition
              ownerPledge {
                declared
              }
              estimatedRewards {
                perYear {
                  percentage
                  ada
                }
                perMonth {
                  percentage
                  ada
                }
                perEpoch {
                  percentage
                  ada
                }
              }
            }
          }
          cursor
          hasMore
          totalCount
        }
      }
    `,
    {
      variables: {
        cursor,
        pageSize: PAGE_SIZE,
        searchOptions: {
          sortBy,
          userAda: userAda !== '' ? userAda : 0,
          searchText,
          performance: formatPerformancetoGQL(performance),
        },
      },
    }
  )

  const onLoadMore = useCallback(() => {
    if (!pagedStakePoolList) return null
    const {cursor} = pagedStakePoolList

    return fetchMore({
      variables: {
        cursor,
        pageSize: PAGE_SIZE,
        searchOptions: {
          sortBy,
          userAda,
          searchText,
          performance: formatPerformancetoGQL(performance),
        },
      },
      updateQuery: (prev, {fetchMoreResult, ...rest}) => {
        if (!fetchMoreResult) return prev
        return {
          ...fetchMoreResult,
          pagedStakePoolList: {
            ...fetchMoreResult.pagedStakePoolList,
            stakePools: [
              ...prev.pagedStakePoolList.stakePools,
              ...fetchMoreResult.pagedStakePoolList.stakePools,
            ],
          },
        }
      },
    })
  }, [pagedStakePoolList, fetchMore, sortBy, userAda, searchText, performance])

  return {loading, error, pagedStakePoolList, onLoadMore}
}
