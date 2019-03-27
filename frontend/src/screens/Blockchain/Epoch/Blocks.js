import React from 'react'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {withProps} from 'recompose'
import idx from 'idx'
import {Grid} from '@material-ui/core'

import {onDidUpdate, onDidMount} from '@/components/HOC/lifecycles'
import Pagination, {getPageCount} from '@/components/visual/Pagination'
import {GET_PAGED_BLOCKS_IN_EPOCH} from '@/api/queries'
import BlocksTable, {COLUMNS_MAP} from '../PagedBlocks/BlocksTable'
import withPagedData from '@/components/HOC/withPagedData'

const {SLOT, TIME, SLOT_LEADER, TRANSACTIONS, TOTAL_SENT, FEES, SIZE} = COLUMNS_MAP
const columns = [SLOT, TIME, SLOT_LEADER, TRANSACTIONS, TOTAL_SENT, FEES, SIZE]
const Blocks = (props) => {
  const {
    pagedDataResult: {loading, error, pagedData: pagedBlocks},
  } = props

  return (
    <Grid container direction="column" justify="flex-end" alignItems="flex-end">
      <Grid item>
        <Pagination
          count={props.totalCount}
          rowsPerPage={props.rowsPerPage}
          page={props.page}
          onChangePage={props.onChangePage}
        />
      </Grid>
      <BlocksTable
        blocks={pagedBlocks && pagedBlocks.blocks}
        columns={columns}
        loading={loading}
        error={error}
      />
    </Grid>
  )
}

const withData = compose(
  graphql(GET_PAGED_BLOCKS_IN_EPOCH, {
    name: 'pagedDataResult',
    options: (props) => ({
      variables: {cursor: props.cursor, epochNumber: props.epochNumber},
    }),
  }),
  withProps(({pagedDataResult}) => ({
    pagedDataResult: {
      ...pagedDataResult,
      pagedData: idx(pagedDataResult, (_) => _.pagedBlocksInEpoch),
    },
  }))
)

const _updateTotalPageCount = ({pagedDataResult, rowsPerPage, setTotalCount, setPage}) => {
  const blocksCount = idx(pagedDataResult, (_) => _.pagedData.blocks.length)
  if (blocksCount) {
    const itemsCount = blocksCount + pagedDataResult.pagedData.cursor
    setTotalCount(itemsCount)
    setPage(getPageCount(itemsCount, rowsPerPage) - 1)
  }
}

const withSetTotalPageCount = compose(
  onDidMount(_updateTotalPageCount),
  onDidUpdate((props, prevProps) => {
    if (
      (props.autoUpdate &&
        prevProps.pagedDataResult.pagedData !== props.pagedDataResult.pagedData) ||
      !props.totalCount
    ) {
      _updateTotalPageCount(props)
    }
  })
)

export default withPagedData({withData, withSetTotalPageCount, initialAutoUpdate: false})(Blocks)
