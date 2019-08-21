// @flow

import React, {useMemo} from 'react'
import classnames from 'classnames'
import {Typography, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {Button, Overlay, LoadingInProgress} from '@/components/visual'
import {LoadingError, LoadingOverlay} from '@/components/common'
import SortByBar from './SortByBar'

import {useLoadPagedStakePoolList} from './dataLoaders'

const messages = defineMessages({
  loadMore: 'Load More',
  noResults: 'No matching results for the given query.',
})

const useStyles = makeStyles((theme) => ({
  rowWrapper: {
    padding: '15px 30px',
    width: '100%',
  },
  wrapper: {
    [theme.breakpoints.up('xl')]: {
      alignItems: 'center',
    },
  },
  loadMore: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6),
    // TODO: use this padding as standard for all buttons
    // Do that after #803 is merged
    paddingLeft: theme.spacing(7),
    paddingRight: theme.spacing(7),
  },
  loadMoreWrapper: {
    width: '100%',
  },
  sortByBar: {
    marginTop: '20px',
    marginBottom: '-15px',
  },
  lastItemSpace: {
    padding: theme.spacing(5),
  },
}))

const StakeList = ({onLoadMore, stakePools, hasMore, loading, StakepoolCard}) => {
  const {translate: tr} = useI18n()
  const classes = useStyles()

  if (loading) return <LoadingInProgress />

  return (
    <Overlay.Wrapper className="w-100">
      {stakePools.map((pool) => (
        <Grid item key={pool.hash} className={classes.rowWrapper}>
          <StakepoolCard data={pool} />
        </Grid>
      ))}
      {hasMore ? (
        <Grid item className={classes.loadMoreWrapper}>
          <Grid container justify="center" direction="row">
            <Button
              variant="contained"
              rounded
              gradient
              className={classes.loadMore}
              onClick={onLoadMore}
            >
              {tr(messages.loadMore)}
            </Button>
          </Grid>
        </Grid>
      ) : (
        <div className={classes.lastItemSpace} />
      )}
      <LoadingOverlay loading={loading} />
    </Overlay.Wrapper>
  )
}

const stakePoolFacade = (data) => ({
  hash: data.poolHash,
  name: data.name,
  description: data.description,
  createdAt: data.createdAt,
  age: data.age,
  fullness: data.summary.fullness,
  margins: data.summary.margins,
  performance: data.summary.performance,
  // TODO: distinguish between `declared` and `actual` pledge?
  pledge: data.summary.ownerPledge.declared,
  stake: data.summary.adaStaked,
  cost: data.summary.cost,
  rewards: data.summary.rewards,
})

const useGetStakeListData = () => {
  const {loading, error, pagedStakePoolList, onLoadMore} = useLoadPagedStakePoolList()

  const notNullPagedData = useMemo(
    () =>
      pagedStakePoolList || {
        totalCount: 0,
        shownPoolsCount: 0,
        stakePools: [],
        hasMore: false,
      },
    [pagedStakePoolList]
  )

  const stakePools = notNullPagedData.stakePools.map(stakePoolFacade)
  const shownPoolsCount = notNullPagedData.stakePools.length
  const {hasMore, totalCount} = notNullPagedData
  return {hasMore, totalCount, shownPoolsCount, stakePools, loading, error, onLoadMore}
}

export const StakeListLayout = ({
  StakepoolCard,
  TopBar,
}: {
  StakepoolCard: React$ComponentType<any>,
  TopBar: React$ComponentType<any>,
}) => {
  const {translate: tr} = useI18n()
  const classes = useStyles()

  const {
    hasMore,
    totalCount,
    shownPoolsCount,
    stakePools,
    loading,
    error,
    onLoadMore,
  } = useGetStakeListData()

  return (
    <React.Fragment>
      <Grid container direction="column" alignItems="flex-start" className={classes.wrapper}>
        <Grid item className={classes.rowWrapper}>
          <TopBar />
        </Grid>
        {loading || error || totalCount > 0 ? (
          <Grid item className={classnames(classes.rowWrapper, classes.sortByBar)}>
            <SortByBar
              loading={loading}
              error={error}
              totalPoolsCount={totalCount}
              shownPoolsCount={shownPoolsCount}
            />
          </Grid>
        ) : (
          <div className={classes.rowWrapper}>
            <Typography>{tr(messages.noResults)}</Typography>
          </div>
        )}
        {error ? (
          <Grid item className={classes.rowWrapper}>
            <LoadingError error={error} />
          </Grid>
        ) : (
          <StakeList
            StakepoolCard={StakepoolCard}
            {...{loading, stakePools, onLoadMore, hasMore}}
          />
        )}
      </Grid>
    </React.Fragment>
  )
}
