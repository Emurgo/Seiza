// @flow
import React from 'react'
import _ from 'lodash'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {withHandlers, withStateHandlers, withProps} from 'recompose'
import {injectIntl} from 'react-intl'

import PaginatedTable, {getPageCount} from './PaginatedTable'
import {onDidUpdate} from '../../../components/HOC/lifecycles'
import {GET_BLOCKS} from '../../../api/queries'

// TODO: auto-update switch

// TODO: for now this is hardcoded both in client and server
const PAGE_SIZE = 10

const withBlocks = graphql(GET_BLOCKS, {
  name: 'blocks',
  options: ({cursor}) => ({
    variables: {cursor},
  }),
})

// TODO: use some HOC to alter props names?
const RecentBlocks = (props) => {
  const {loading, blocks} = props.blocks
  return (
    <React.Fragment>
      {!loading && (
        <PaginatedTable
          rowsPerPage={props.rowsPerPage}
          page={props.page}
          totalCount={props.totalCount}
          onChangePage={props.onChangePage}
          blocks={blocks.blocks}
          rowsPerPageOptions={[props.rowsPerPage]}
        />
      )}
    </React.Fragment>
  )
}

export default compose(
  injectIntl,
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
  onDidUpdate(({setTotalCount, totalCount, blocks, setPage, rowsPerPage}) => {
    const blocksCount = _.get(blocks, 'blocks.blocks.length')
    if (blocksCount && !totalCount) {
      const itemsCount = blocksCount + blocks.blocks.cursor
      setTotalCount(itemsCount)
      setPage(getPageCount(itemsCount, rowsPerPage) - 1)
    }
  }),
  withHandlers({
    onChangePage: ({setPage, page, totalCount, blocks: blocksData, rowsPerPage}) => (newPage) => {
      const {fetchMore} = blocksData

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
