import React, {useState} from 'react'
import idx from 'idx'
import {defineMessages} from 'react-intl'
import {Grid} from '@material-ui/core'
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
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
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

  return (
    <Grid container direction="column">
      <Grid item>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          className={classes.wrapper}
        >
          <Grid item>
            <EntityHeading>{tr(messages.blocks, {count: formatInt(blocksCount)})}</EntityHeading>
          </Grid>
          <Grid item>
            <Pagination
              count={totalItemsCount}
              rowsPerPage={rowsPerPage}
              page={page || 0}
              onChangePage={onChangePage}
              reverseDirection
            />
          </Grid>
        </Grid>
      </Grid>
      <BlocksTable {...{blocks, columns, loading, error}} />
    </Grid>
  )
}

export default Blocks
