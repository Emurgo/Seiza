// @flow

import React, {useCallback} from 'react'
import {makeStyles} from '@material-ui/styles'

import {LoadingInProgress} from '@/components/visual'
import {LoadingError} from '@/components/common'
import {useManageQueryValue} from '@/components/hooks/useManageQueryValue'
import {toIntOrNull} from '@/helpers/utils'

// TODO: load custom pools here, temporarily reused
import {useLoadStakepools} from '@/screens/StakingPools/dataLoaders'
import {FiltersProvider} from '@/screens/StakingPools/filtersUtils'
import {SortOptionsProvider} from '@/screens/StakingPools/sortUtils'
import {
  StakingPools,
  LEFT_ARROW_OFFSET,
  RIGHT_ARROW_OFFSET,
  ARROWS_BREAKPOINT,
} from '@/screens/StakingPools'

const useStyles = makeStyles((theme) => ({
  tableWrapper: {
    margin: 0,
    [theme.breakpoints.up(ARROWS_BREAKPOINT)]: {
      marginLeft: -LEFT_ARROW_OFFSET,
      marginRight: -RIGHT_ARROW_OFFSET,
    },
  },
}))

export default () => {
  const classes = useStyles()

  const {stakepools, loading, error} = useLoadStakepools()
  const [page, setPage] = useManageQueryValue('stake-pools-page', 1, toIntOrNull)

  // TODO: try to reuse this function and Providers from 'StakingPools' folder,
  // but wait till requirements are specified
  // Note: we also reset page when sortBy/filter changes
  const resetPage = useCallback(() => setPage(1), [setPage])
  const onSortByChange = resetPage
  const onFilterChange = resetPage

  return (
    <React.Fragment>
      {error || loading ? (
        error ? (
          <LoadingError error={error} />
        ) : (
          <LoadingInProgress />
        )
      ) : (
        <div className={classes.tableWrapper}>
          <SortOptionsProvider onChange={onSortByChange}>
            <FiltersProvider allPools={stakepools} onChange={onFilterChange}>
              <StakingPools {...{page, setPage, stakepools}} />
            </FiltersProvider>
          </SortOptionsProvider>
        </div>
      )}
    </React.Fragment>
  )
}
