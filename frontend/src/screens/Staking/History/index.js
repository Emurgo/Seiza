// @flow
import React, {useState, useMemo} from 'react'
import cn from 'classnames'
import _ from 'lodash'
import {defineMessages} from 'react-intl'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {fade} from '@material-ui/core/styles/colorManipulator'

import {getPageCount} from '@/helpers/utils'
import {useIsMobile} from '@/components/hooks/useBreakpoints'
import {Card, Pagination, ContentSpacing} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'

// TODO: Consider extracting this outside ComparisonMatrix
import {ItemIdentifier} from '@/components/visual/ComparisonMatrix/utils'
import {ReactComponent as EpochIcon} from '@/static/assets/icons/epoch.svg'

import {WithEnsureStakePoolsLoaded, WithEnsureDataLoaded} from '../utils'
import {POOL_ACTION_RENDERERS} from './common'
import {useLoadCurrentEpoch, useLoadPoolsHistory, useLoadSelectedPoolsData} from './dataLoaders'

const ROWS_PER_PAGE = 5

const messages = defineMessages({
  epoch: 'Epoch:',
  currentEpoch: 'Current epoch:',
})

const useHistoryHeaderStyles = makeStyles((theme) => ({
  wrapper: {
    height: 60,
    padding: theme.spacing(2),
    background: theme.palette.background.paperContrast,
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  label: {
    marginRight: theme.spacing(1),
  },
}))

const HistoryHeader = ({label, value}) => {
  const classes = useHistoryHeaderStyles()
  return (
    <Grid container className={classes.wrapper} alignItems="center">
      <div className={cn(classes.icon, 'd-flex')}>
        <EpochIcon />
      </div>
      <Typography color="textSecondary" variant="overline" className={classes.label}>
        {label}
      </Typography>
      <Typography variant="caption">{value}</Typography>
    </Grid>
  )
}

const useHistoryBodyStyles = makeStyles((theme) => ({
  header: {
    padding: theme.spacing(2),
  },
  row: {
    // Note: same as for Block table, consider some common component/class
    'padding': theme.spacing(2),
    'transition': theme.hover.transitionOut(['box-shadow']),
    'borderTop': '1px solid transparent', // Note: for rows not to change size on hover
    '&:hover': {
      borderTop: `1px solid ${theme.palette.unobtrusiveContentHighlight}`,
      borderRadius: '3px',
      boxShadow: `0px 10px 30px ${fade(theme.palette.text.primary, 0.11)}`,
      transition: theme.hover.transitionIn(['box-shadow']),
    },
  },
  borderBottom: {
    borderBottom: `1px solid ${theme.palette.contentUnfocus}`,
  },
  changes: {
    '& > :not(:last-child)': {
      borderBottom: `1px solid ${theme.palette.unobtrusiveContentHighlight}`,
    },
  },
}))

const stakePoolNameSelector = (stakePoolsMap, poolHash) => stakePoolsMap[poolHash].name

// TODO: there should be link for StakePool
const HistoryBody = ({changes, stakePoolsMap}) => {
  const classes = useHistoryBodyStyles()
  return _.toPairs(changes).map(([poolHash, poolChanges], index, arr) => {
    const isLast = index === arr.length - 1
    return (
      <Grid container key={poolHash} className={cn(!isLast && classes.borderBottom)}>
        <Grid item xs={12} className={classes.header}>
          <ItemIdentifier
            identifier={poolHash}
            title={stakePoolNameSelector(stakePoolsMap, poolHash)}
          />
        </Grid>
        <Grid item xs={12} className={classes.changes}>
          {_.map(poolChanges, (value, key) => {
            const Renderer = POOL_ACTION_RENDERERS[key]
            return (
              <div key={key} className={classes.row}>
                <Renderer value={value} />
              </div>
            )
          })}
        </Grid>
      </Grid>
    )
  })
}

const formatFutureEpochLabel = (epochNumber, currentEpochNumber) => {
  return `${epochNumber} (${currentEpochNumber} + ${epochNumber - currentEpochNumber})`
}

const HistoryCard = ({changes, epochNumber, currentEpochNumber, stakePoolsMap}) => {
  const {translate: tr} = useI18n()
  const headerLabel = tr(
    epochNumber === currentEpochNumber ? messages.currentEpoch : messages.epoch
  )
  const headerValue =
    epochNumber > currentEpochNumber
      ? formatFutureEpochLabel(epochNumber, currentEpochNumber)
      : epochNumber
  return (
    <ContentSpacing type="margin" bottom={0.75} top={0.75} left={0.5} right={0.5}>
      <Card>
        <Grid container>
          <Grid item xs={12}>
            <HistoryHeader value={headerValue} label={headerLabel} />
          </Grid>
          <Grid item xs={12}>
            <HistoryBody {...{changes, stakePoolsMap}} />
          </Grid>
        </Grid>
      </Card>
    </ContentSpacing>
  )
}

const usePaginationStyles = makeStyles((theme) => ({
  wrapper: {
    paddingRight: theme.spacing(1),
    marginTop: ({isMobile, placement}) =>
      isMobile ? (placement === 'up' ? theme.spacing(2) : 0) : 0,
    marginBottom: ({isMobile, placement}) =>
      isMobile ? (placement === 'down' ? theme.spacing(2) : 0) : 0,
  },
}))

const PaginationWrapper = ({children, placement}) => {
  const isMobile = useIsMobile()
  const classes = usePaginationStyles({isMobile, placement})

  return (
    <Grid container justify="flex-end" className={classes.wrapper}>
      <Grid item>{children}</Grid>
    </Grid>
  )
}

const _HistoryCards = ({stakePools, poolsHistory, currentEpochNumber}) => {
  const stakePoolsMap = useMemo(() => _.keyBy(stakePools, (pool) => pool.poolHash), [stakePools])
  const [page, setPage] = useState(1)

  const currentChanges = poolsHistory.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

  const pagination = (
    <Pagination
      pageCount={getPageCount(poolsHistory.length, ROWS_PER_PAGE)}
      page={page}
      onChangePage={setPage}
    />
  )

  return (
    <React.Fragment>
      <PaginationWrapper placement="up">{pagination}</PaginationWrapper>
      {currentChanges.map(({epochNumber, changes}) => (
        <HistoryCard
          key={epochNumber}
          {...{epochNumber, changes, stakePoolsMap, currentEpochNumber}}
        />
      ))}
      <PaginationWrapper placement="down">{pagination}</PaginationWrapper>
    </React.Fragment>
  )
}

const HistoryCards = ({stakePools, currentEpochNumber}) => {
  const poolHashes = useMemo(() => stakePools.map((p) => p.poolHash), [stakePools])
  const {loading, error, data} = useLoadPoolsHistory(poolHashes, currentEpochNumber + 1)

  return (
    <WithEnsureDataLoaded {...{loading, error, data}}>
      {({data: poolsHistory}) => (
        <_HistoryCards {...{stakePools, poolsHistory, currentEpochNumber}} />
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
          {({data: stakePools}) => <HistoryCards {...{stakePools, currentEpochNumber}} />}
        </WithEnsureStakePoolsLoaded>
      )}
    </WithEnsureDataLoaded>
  )
}

export default HistoryScreen
