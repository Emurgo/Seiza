// @flow
import React, {useState} from 'react'
import _ from 'lodash'
import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {getPageCount} from '@/helpers/utils'
import {Pagination} from '@/components/common'

import {HistoryMultiplePools} from '@/screens/Blockchain/common/History'

import {WithEnsureStakePoolsLoaded, WithEnsureDataLoaded} from '../utils'
import {useLoadCurrentEpoch, useLoadPoolsHistory, useLoadSelectedPoolsData} from './dataLoaders'

// TODO: increase with real data
const ROWS_PER_PAGE = 1

const usePaginationStyles = makeStyles((theme) => ({
  wrapper: {
    paddingRight: theme.spacing(1),
    marginTop: ({placement}) => (placement === 'down' ? theme.spacing(2) : 0),
    marginBottom: ({placement}) => (placement === 'up' ? theme.spacing(2) : 0),
  },
}))

const PaginationWrapper = ({children, placement}) => {
  const classes = usePaginationStyles({placement})

  return (
    <Grid container justify="flex-end" className={classes.wrapper}>
      <Grid item>{children}</Grid>
    </Grid>
  )
}

const getPoolsHistoriesByEpoch = (poolsHistory) => {
  const epochNumbers = Array.from(
    new Set(
      _(poolsHistory)
        .map((poolHistory) => poolHistory.history)
        .flatten()
        .map((history) => history.epochNumber)
        .value()
    )
  )

  const result = epochNumbers.map((epochNumber) => {
    const poolHistoriesFilteredByEpochNumber = poolsHistory.map(({history, ...rest}) => {
      const filteredEpochHistory = history.filter((h) => h.epochNumber === epochNumber)
      return {history: filteredEpochHistory, ...rest}
    })

    return {epochNumber, poolHistories: poolHistoriesFilteredByEpochNumber}
  })

  return result
}

const useHistoryContentStyles = makeStyles(({spacing}) => ({
  space: {
    '& > :not(:last-child)': {
      marginBottom: spacing(4),
    },
  },
}))

const _HistoryContent = ({stakepools, poolsHistory, currentEpochNumber}) => {
  const [page, setPage] = useState(1)
  const classes = useHistoryContentStyles()

  const historiesByEpoch = getPoolsHistoriesByEpoch(poolsHistory)
  const currentPageItems = historiesByEpoch.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

  const pagination = (
    <Pagination
      pageCount={getPageCount(historiesByEpoch.length, ROWS_PER_PAGE)}
      page={page}
      onChangePage={setPage}
    />
  )

  return (
    <React.Fragment>
      <PaginationWrapper placement="up">{pagination}</PaginationWrapper>
      <div className={classes.space}>
        <HistoryMultiplePools
          poolsHistory={currentPageItems}
          currentEpochNumber={currentEpochNumber}
        />
      </div>
      <PaginationWrapper placement="down">{pagination}</PaginationWrapper>
    </React.Fragment>
  )
}

const HistoryContent = ({stakepools, currentEpochNumber}) => {
  const {loading, error, data} = useLoadPoolsHistory(stakepools, currentEpochNumber + 1)

  return (
    <WithEnsureDataLoaded {...{loading, error, data}}>
      {({data: poolsHistory}) => (
        <_HistoryContent {...{stakepools, poolsHistory, currentEpochNumber}} />
      )}
    </WithEnsureDataLoaded>
  )
}

const HistoryScreen = () => {
  const poolsRes = useLoadSelectedPoolsData()
  const epochRes = useLoadCurrentEpoch()
  // Note: we dont combine this as WithEnsureStakePoolsLoaded specificaly handles empty stake
  // pools and WithEnsureDataLoaded is just a generic data loader
  return (
    <WithEnsureDataLoaded
      loading={epochRes.loading}
      error={epochRes.error}
      data={epochRes.currentEpoch}
    >
      {({data: currentEpochNumber}) => (
        <WithEnsureStakePoolsLoaded
          loading={poolsRes.loading}
          error={poolsRes.error}
          data={poolsRes.data}
        >
          {({data: stakepools}) => <HistoryContent {...{stakepools, currentEpochNumber}} />}
        </WithEnsureStakePoolsLoaded>
      )}
    </WithEnsureDataLoaded>
  )
}

export default HistoryScreen
