// @flow
import React from 'react'
import gql from 'graphql-tag'
import idx from 'idx'
import {useQuery} from 'react-apollo-hooks'

import {Pagination} from '@/components/visual'
import {useManageQueryValue} from '@/components/hooks/useManageQueryValue'
import {toIntOrNull} from '@/helpers/utils'

const useLoadData = (cursor, autoUpdate) => {
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

// TODO: adjust to needs
const ROWS_PER_PAGE = 30

const StakingPools = () => {
  const {stakePools, loading, error} = useLoadData()

  const [page, setPage] = useManageQueryValue('page', 1, toIntOrNull)

  const stakePoolsToShow = stakePools.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

  if (loading) {
    // TODO: do something
  }

  if (error) {
    // TODO: do something
  }

  // TODO: just to get data, waiting for final layout, no styling therefore
  return (
    <div>
      <Pagination
        count={stakePools.length}
        rowsPerPage={ROWS_PER_PAGE}
        page={page}
        onChangePage={setPage}
      />
      <ul>
        {stakePoolsToShow.map(({poolHash}) => (
          <li key={poolHash}>{poolHash}</li>
        ))}
      </ul>
    </div>
  )
}

export default StakingPools
