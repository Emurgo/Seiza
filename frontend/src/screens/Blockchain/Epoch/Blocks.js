import React, {useState, useEffect} from 'react'
import idx from 'idx'
import {defineMessages} from 'react-intl'
import {Grid, Hidden} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import Pagination from '@/components/visual/Pagination'
import {GET_PAGED_BLOCKS_IN_EPOCH} from '@/api/queries'
import {useI18n} from '@/i18n/helpers'
import {
  useBlocksTablePagedProps,
  rowsPerPage,
  getTotalItemsCount,
} from '@/components/hooks/useBlocksTablePagedProps'
import {useQueryNotBuggedForBlocks} from '@/components/hooks/useQueryNotBugged'
import {EntityHeading} from '@/components/visual'
import {useManageQueryValue} from '@/components/hooks/useManageQueryValue'
import {toIntOrNull} from '@/helpers/utils'
import BlocksTable, {COLUMNS_MAP} from '../PagedBlocks/BlocksTable'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      justifyContent: 'center',
    },
  },
  heading: {
    marginTop: theme.spacing.unit * 3,
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing.unit * 3,
    },
  },
  bottomPagination: {
    marginTop: theme.spacing.unit * 3,
  },
}))

const messages = defineMessages({
  blocks: ' {count} {count, plural, =0 {Blocks} one {Block} other {Blocks}}',
})

const useLoadData = (cursor, epochNumber, pollInterval) => {
  const {error, loading, data} = useQueryNotBuggedForBlocks(GET_PAGED_BLOCKS_IN_EPOCH, {
    variables: {cursor, epochNumber},
    notifyOnNetworkStatusChange: true,
    pollInterval,
  })

  const pagedData = idx(data.pagedBlocksInEpoch, (_) => _.blocks)

  return {
    loading,
    error,
    pagedDataResult: {
      ...data.pagedBlocksInEpoch,
      pagedData,
    },
  }
}

const {SLOT, TIME, SLOT_LEADER, TRANSACTIONS, TOTAL_SENT, FEES, SIZE} = COLUMNS_MAP
const columns = [SLOT, TIME, SLOT_LEADER, TRANSACTIONS, TOTAL_SENT, FEES, SIZE]

const Blocks = ({blocksCount, epochNumber, pollInterval}) => {
  const classes = useStyles()
  const {translate: tr, formatInt} = useI18n()

  const [page, setPage] = useManageQueryValue('page', null, toIntOrNull)
  const [cursor, setCursor] = useState(null)
  const {pagedDataResult, loading, error} = useLoadData(cursor, epochNumber, pollInterval)
  const [totalItemsCount, setTotalItemsCount] = useState(0)

  const [prevEpoch, setPrevEpoch] = useState(epochNumber)

  const {onChangePage} = useBlocksTablePagedProps(
    page,
    setPage,
    setCursor,
    totalItemsCount,
    setTotalItemsCount
  )
  console.log('cursor', cursor)

  // Reset values after epoch was changed
  // TODO: this is hot-fix, lets refactor this part soon as it is fragile
  useEffect(() => {
    if (epochNumber !== prevEpoch) {
      setPrevEpoch(epochNumber)
      setCursor(null)
      setPage(null)
      setTotalItemsCount(0)
      return
    }

    // TODO: consider nicer solution, hot fix for now
    if (!loading && pagedDataResult.pagedData) {
      setCursor(
        page
          ? Math.min(getTotalItemsCount(pagedDataResult), page * rowsPerPage)
          : getTotalItemsCount(pagedDataResult)
      )
      setTotalItemsCount(getTotalItemsCount(pagedDataResult))
    }
  })

  const {blocks} = pagedDataResult

  const pagination = (
    <Pagination
      count={totalItemsCount}
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={onChangePage}
      reverseDirection
    />
  )

  return (
    <Grid container direction="column">
      <Grid item className={classes.heading}>
        <Grid container justify="center">
          <EntityHeading>{tr(messages.blocks, {count: formatInt(blocksCount)})}</EntityHeading>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container className={classes.wrapper}>
          <Grid item>{pagination}</Grid>
        </Grid>
      </Grid>
      <BlocksTable {...{blocks, columns, loading, error}} />
      {blocks && (
        <Hidden mdUp>
          <Grid item className={classes.bottomPagination}>
            {pagination}
          </Grid>
        </Hidden>
      )}
    </Grid>
  )
}

export default Blocks
