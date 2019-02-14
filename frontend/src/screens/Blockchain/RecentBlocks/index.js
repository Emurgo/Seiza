// @flow
import React from 'react'
import _ from 'lodash'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {withHandlers, withStateHandlers} from 'recompose'
import {injectIntl} from 'react-intl'

import PaginatedTable from './PaginatedTable'
import {onDidUpdate} from '../../../components/HOC/lifecycles'
import {GET_BLOCKS} from '../../../api/queries'

// TODO: smart vs basic table

// TODO: for now this is hardcoded both in client and server
// TODO: flow or typescript?
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
          rowsPerPage={PAGE_SIZE}
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
  withStateHandlers(
    {page: 0, totalCount: 0},
    {
      setPage: () => (page) => ({page}),
      setTotalCount: () => (totalCount) => ({totalCount}),
    }
  ),
  // Note: remember blocks count from the first fetch
  onDidUpdate(({setTotalCount, totalCount, blocks}) => {
    const blocksCount = _.get(blocks, 'blocks.blocks.length')
    if (blocksCount && !totalCount) {
      setTotalCount(blocksCount + blocks.blocks.cursor)
    }
  }),
  withHandlers({
    onChangePage: ({setPage, page, totalCount, blocks: blocksData}) => (newPage) => {
      const {fetchMore} = blocksData
      const cursor = totalCount - PAGE_SIZE * newPage

      // Note: 'fetchMore' is built-in apollo function
      fetchMore({
        // TODO: in case the 'cursor' is null disable caching and also update 'totalCount'
        variables: cursor ? {cursor} : {},
        updateQuery: (prev, {fetchMoreResult, ...rest}) => {
          if (!fetchMoreResult) return prev
          return fetchMoreResult
        },
      })
      return setPage(newPage)
    },
  })
)(RecentBlocks)
