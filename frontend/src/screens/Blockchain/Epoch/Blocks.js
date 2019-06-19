import React, {useState, useEffect} from 'react'
import {defineMessages} from 'react-intl'
import {Grid, Hidden} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import Pagination from '@/components/visual/Pagination'
import {GET_PAGED_BLOCKS_IN_EPOCH} from '@/api/queries'
import {useI18n} from '@/i18n/helpers'
import {useQueryNotBuggedForBlocks} from '@/components/hooks/useQueryNotBugged'
import {EntityHeading} from '@/components/visual'
import {useManageQueryValue} from '@/components/hooks/useManageQueryValue'
import {toIntOrNull} from '@/helpers/utils'
import BlocksTable, {COLUMNS_MAP} from '../PagedBlocks/BlocksTable'
import {getPageAndBoundaryFromCursor} from '../PagedBlocks/util'

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

const useLoadData = (cursor, epochNumber) => {
  const {error, loading, data} = useQueryNotBuggedForBlocks(GET_PAGED_BLOCKS_IN_EPOCH, {
    variables: {cursor, epochNumber},
    notifyOnNetworkStatusChange: true,
  })

  return {
    loading,
    error,
    data: data.pagedBlocksInEpoch,
  }
}

const {SLOT, TIME, SLOT_LEADER, TRANSACTIONS, TOTAL_SENT, FEES, SIZE} = COLUMNS_MAP
const columns = [SLOT, TIME, SLOT_LEADER, TRANSACTIONS, TOTAL_SENT, FEES, SIZE]

const PAGE_SIZE = 10
const rowsPerPage = PAGE_SIZE

const useEpochBlockData = (epochNumber) => {
  const [prevEpoch, setPrevEpoch] = useState(epochNumber)
  const [totalCount, setTotalCount] = useState(0)

  const [page, setPage] = useManageQueryValue('page', null, toIntOrNull)
  const {data: pagedDataResult, loading, error} = useLoadData(
    page == null ? null : page * rowsPerPage,
    epochNumber
  )

  const {totalCount: dataTotalCount, blocks} = pagedDataResult || {}
  const effectivePage = page == null ? Math.ceil(totalCount / rowsPerPage) : page

  useEffect(() => {
    if (dataTotalCount > totalCount) setTotalCount(dataTotalCount)
  })

  // Reset values after epoch was changed
  // TODO: this is hot-fix, lets refactor this part soon as it is fragile
  useEffect(() => {
    if (epochNumber !== prevEpoch) {
      setPrevEpoch(epochNumber)
      setTotalCount(0)
      setPage(null)
    }
  })

  return {
    page,
    effectivePage,
    setPage,
    loading,
    error,
    blocks,
    totalCount: totalCount || 0,
    nextPageCursor: pagedDataResult && pagedDataResult.cursor,
  }
}

const Blocks = ({blocksCount, epochNumber}) => {
  const classes = useStyles()
  const {translate: tr, formatInt} = useI18n()

  const {
    totalCount,
    effectivePage,
    setPage,
    nextPageCursor,
    loading,
    error,
    blocks,
  } = useEpochBlockData(epochNumber)

  const pagination = (
    <Pagination
      count={totalCount}
      rowsPerPage={rowsPerPage}
      page={effectivePage}
      onChangePage={setPage}
      reverseDirection
    />
  )

  const {nextPageNumber, pageBoundary} = getPageAndBoundaryFromCursor(nextPageCursor, rowsPerPage)

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
      <BlocksTable {...{blocks, columns, loading, error, nextPageNumber, pageBoundary}} />
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
