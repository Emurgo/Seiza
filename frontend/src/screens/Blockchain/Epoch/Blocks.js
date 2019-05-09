import React, {useState} from 'react'
import idx from 'idx'
import {defineMessages} from 'react-intl'
import {Grid, Hidden} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import Pagination from '@/components/visual/Pagination'
import {GET_PAGED_BLOCKS_IN_EPOCH} from '@/api/queries'
import {useI18n} from '@/i18n/helpers'
import {
  useBlocksTablePagedProps,
  useTotalItemsCount,
} from '@/components/hooks/useBlocksTablePagedProps'
import {useQueryNotBugged} from '@/components/hooks/useQueryNotBugged'
import {EntityHeading} from '@/components/visual'
import {useManageQueryValue} from '@/components/hooks/useManageQueryValue'
import {toIntOrNull} from '@/helpers/utils'
import BlocksTable, {COLUMNS_MAP} from '../PagedBlocks/BlocksTable'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      justifyContent: 'center',
    },
  },
  heading: {
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
  const {error, loading, data} = useQueryNotBugged(GET_PAGED_BLOCKS_IN_EPOCH, {
    variables: {cursor, epochNumber},
    notifyOnNetworkStatusChange: true,
  })

  const pagedData = idx(data.pagedBlocksInEpoch, (_) => _.blocks)

  return {
    error,
    loading,
    pagedDataResult: {
      ...data.pagedBlocksInEpoch,
      pagedData,
    },
  }
}

const {SLOT, TIME, SLOT_LEADER, TRANSACTIONS, TOTAL_SENT, FEES, SIZE} = COLUMNS_MAP
const columns = [SLOT, TIME, SLOT_LEADER, TRANSACTIONS, TOTAL_SENT, FEES, SIZE]

const Blocks = ({blocksCount, epochNumber}) => {
  const classes = useStyles()
  const {translate: tr, formatInt} = useI18n()

  const [page, setPage] = useManageQueryValue('page', null, toIntOrNull)
  const [cursor, setCursor] = useState(null)

  const {pagedDataResult, loading, error} = useLoadData(cursor, epochNumber)
  const [totalItemsCount, setTotalItemsCount] = useTotalItemsCount(pagedDataResult)

  const {onChangePage, rowsPerPage} = useBlocksTablePagedProps(
    page,
    setPage,
    setCursor,
    totalItemsCount,
    setTotalItemsCount
  )
  const {blocks} = pagedDataResult

  const pagination = (
    <Pagination
      count={totalItemsCount}
      rowsPerPage={rowsPerPage}
      page={page || 0}
      onChangePage={onChangePage}
      reverseDirection
    />
  )

  return (
    <Grid container direction="column">
      <Grid item>
        <Grid container className={classes.wrapper}>
          <Grid item className={classes.heading}>
            <EntityHeading>{tr(messages.blocks, {count: formatInt(blocksCount)})}</EntityHeading>
          </Grid>
          <Grid item>{pagination}</Grid>
        </Grid>
      </Grid>
      <BlocksTable {...{blocks, columns, loading, error}} />
      <Hidden mdUp>
        <Grid item className={classes.bottomPagination}>
          {pagination}
        </Grid>
      </Hidden>
    </Grid>
  )
}

export default Blocks
