// @flow
import React, {useState, useMemo} from 'react'
import cn from 'classnames'
import _ from 'lodash'
import gql from 'graphql-tag'
import idx from 'idx'
import {defineMessages} from 'react-intl'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {fade} from '@material-ui/core/styles/colorManipulator'
import {useQuery} from 'react-apollo-hooks'

import {getPageCount} from '@/helpers/utils'
import {useIsMobile} from '@/components/hooks/useBreakpoints'
import {Card, Pagination, ContentSpacing} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'

// TODO: Consider extracting this outside ComparisonMatrix
import {ItemIdentifier} from '@/components/visual/ComparisonMatrix/utils'
import {ReactComponent as EpochIcon} from '@/static/assets/icons/epoch.svg'

import {useSelectedPoolsContext} from '../context/selectedPools'
import {getMockedHistory} from './mockedData'
import {WithEnsureStakePoolsLoaded} from '../utils'
import {POOL_ACTION_RENDERERS} from './common'

const ROWS_PER_PAGE = 5

const messages = defineMessages({
  epoch: 'Epoch:',
})

export const useLoadSelectedPoolsData = () => {
  const {selectedPools: poolHashes} = useSelectedPoolsContext()
  const {loading, error, data} = useQuery(
    gql`
      query($poolHashes: [String!]!) {
        stakePools(poolHashes: $poolHashes) {
          name
          poolHash
        }
      }
    `,
    {
      variables: {poolHashes},
    }
  )
  return {loading, error, data: idx(data, (_) => _.stakePools)}
}

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

const HistoryCard = ({changes, epochNumber, stakePoolsMap}) => {
  const {translate: tr} = useI18n()
  return (
    <ContentSpacing type="margin" bottom={0.75} top={0.75} left={0.5} right={0.5}>
      <Card>
        <Grid container>
          <Grid item xs={12}>
            <HistoryHeader label={tr(messages.epoch)} value={epochNumber} />
          </Grid>
          <Grid item xs={12}>
            <HistoryBody {...{changes, stakePoolsMap}} />
          </Grid>
        </Grid>
      </Card>
    </ContentSpacing>
  )
}

// TODO: "current" and "next" epoch

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

const HistoryCards = ({stakePools}) => {
  // TODO: get current epoch
  const currentEpoch = 50
  const poolHashes = useMemo(() => stakePools.map((p) => p.poolHash), [stakePools])
  const stakePoolsMap = useMemo(() => _.keyBy(stakePools, (pool) => pool.poolHash), [stakePools])
  const changesData = useMemo(() => getMockedHistory(poolHashes, currentEpoch), [poolHashes])
  const [page, setPage] = useState(1)

  const currentChanges = changesData.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

  const pagination = (
    <Pagination
      pageCount={getPageCount(changesData.length, ROWS_PER_PAGE)}
      page={page}
      onChangePage={setPage}
    />
  )

  return (
    <React.Fragment>
      <PaginationWrapper placement="up">{pagination}</PaginationWrapper>

      {currentChanges.map(({epochNumber, changes}) => (
        <HistoryCard key={epochNumber} {...{epochNumber, changes, stakePoolsMap}} />
      ))}
      <PaginationWrapper placement="down">{pagination}</PaginationWrapper>
    </React.Fragment>
  )
}

const HistoryScreen = () => {
  const {loading, error, data} = useLoadSelectedPoolsData()
  return (
    <WithEnsureStakePoolsLoaded {...{loading, error, data}}>
      {({data: stakePools}) => <HistoryCards stakePools={stakePools} />}
    </WithEnsureStakePoolsLoaded>
  )
}

export default HistoryScreen
