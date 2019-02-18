// @flow
import React from 'react'
import idx from 'idx'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {withHandlers, withStateHandlers, withProps} from 'recompose'

import PaginatedTable, {getPageCount} from './PaginatedTable'
import {onDidUpdate} from '../../../components/HOC/lifecycles'
import {GET_PAGED_BLOCKS} from '../../../api/queries'

// TODO: auto-update switch

// TODO: for now this is hardcoded both in client and server
const PAGE_SIZE = 10

const withBlocks = graphql(GET_PAGED_BLOCKS, {
  name: 'pagedBlocksResult',
  options: ({cursor}) => ({
    variables: {cursor},
  }),
})

// TODO: use some HOC to alter props names?
const RecentBlocks = (props) => {
  const {loading, pagedBlocks} = props.pagedBlocksResult
  return (
    <React.Fragment>
      {!loading && (
        <PaginatedTable
          rowsPerPage={props.rowsPerPage}
          page={props.page}
          totalCount={props.totalCount}
          onChangePage={props.onChangePage}
          blocks={pagedBlocks.blocks}
          rowsPerPageOptions={[props.rowsPerPage]}
        />
      )}
    </React.Fragment>
  )
}

export default compose(
  withBlocks,
  withProps(() => ({
    rowsPerPage: PAGE_SIZE,
  })),
  withStateHandlers(
    {page: 0, totalCount: 0},
    {
      setPage: () => (page) => ({page}),
      setTotalCount: () => (totalCount) => ({totalCount}),
    }
  ),
  // Note: remember blocks count from the first fetch
  onDidUpdate(({setTotalCount, setPage, totalCount, pagedBlocksResult, rowsPerPage}) => {
    const blocksCount = idx(pagedBlocksResult, (_) => _.pagedBlocks.blocks.length)
    if (blocksCount && !totalCount) {
      const itemsCount = blocksCount + pagedBlocksResult.pagedBlocks.cursor
      setTotalCount(itemsCount)
      setPage(getPageCount(itemsCount, rowsPerPage) - 1)
    }
  }),
  withHandlers({
    onChangePage: ({setPage, page, totalCount, pagedBlocksResult, rowsPerPage}) => (newPage) => {
      const {fetchMore} = pagedBlocksResult

      const cursor =
        newPage === getPageCount(totalCount, rowsPerPage) - 1
          ? totalCount
          : rowsPerPage * newPage + rowsPerPage

      // Note: 'fetchMore' is built-in apollo function
      fetchMore({
        variables: {cursor},
        updateQuery: (prev, {fetchMoreResult, ...rest}) => {
          if (!fetchMoreResult) return prev
          return fetchMoreResult
        },
      })
      return setPage(newPage)
    },
  })
)(RecentBlocks)
