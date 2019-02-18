// @flow
import React from 'react'
import idx from 'idx'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {withHandlers, withStateHandlers, withProps} from 'recompose'
import {Switch} from '@material-ui/core'

import PaginatedTable, {getPageCount} from './PaginatedTable'
import {onDidUpdate} from '../../../components/HOC/lifecycles'
import {GET_PAGED_BLOCKS} from '../../../api/queries'

// TODO: for now `PAGE_SIZE` is hardcoded both in client and server
const PAGE_SIZE = 10
const LATEST_BLOCKS_REFRESH_INTERVAL = 2 * 1000
const POLLING_OFF = 0

const withBlocks = graphql(GET_PAGED_BLOCKS, {
  name: 'pagedBlocksResult',
  options: (props) => ({
    variables: {cursor: props.cursor},
    pollInterval: props.autoUpdate ? LATEST_BLOCKS_REFRESH_INTERVAL : POLLING_OFF,
  }),
})

// TODO: intl
// TODO: Grid && typography
const AutoUpdateSwitch = ({checked, onChange}) => (
  <div>
    <span>Refresh state</span>
    <Switch color="primary" checked={checked} onChange={onChange} />
  </div>
)

const RecentBlocks = (props) => {
  const {loading, pagedBlocks} = props.pagedBlocksResult
  return (
    <React.Fragment>
      {!loading && (
        <React.Fragment>
          <AutoUpdateSwitch checked={props.autoUpdate} onChange={props.onChangeAutoUpdate} />
          <PaginatedTable
            rowsPerPage={props.rowsPerPage}
            page={props.page}
            totalCount={props.totalCount}
            onChangePage={props.onChangePage}
            blocks={pagedBlocks.blocks}
            rowsPerPageOptions={[props.rowsPerPage]}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default compose(
  withProps(() => ({
    rowsPerPage: PAGE_SIZE,
  })),
  withStateHandlers(
    {page: 0, totalCount: 0, autoUpdate: true},
    {
      setPage: () => (page) => ({page}),
      setTotalCount: () => (totalCount) => ({totalCount}),
      setAutoUpdate: () => (autoUpdate) => ({autoUpdate}),
    }
  ),
  withBlocks,
  onDidUpdate(
    (
      {autoUpdate, setTotalCount, setPage, rowsPerPage, totalCount, pagedBlocksResult},
      prevProps
    ) => {
      const blocksCount = idx(pagedBlocksResult, (_) => _.pagedBlocks.blocks.length)
      if (
        blocksCount &&
        ((autoUpdate &&
          prevProps.pagedBlocksResult.pagedBlocks !== pagedBlocksResult.pagedBlocks) ||
          !totalCount)
      ) {
        const itemsCount = blocksCount + pagedBlocksResult.pagedBlocks.cursor
        setTotalCount(itemsCount)
        setPage(getPageCount(itemsCount, rowsPerPage) - 1)
      }
    }
  ),
  withHandlers({
    onChangeAutoUpdate: ({setAutoUpdate}) => (event) => {
      // Note: calling graphQL `refresh` here causes unmount of whole element
      setAutoUpdate(event.target.checked)
    },
    onChangePage: ({
      setPage,
      totalCount,
      pagedBlocksResult,
      rowsPerPage,
      setAutoUpdate,
      autoUpdate,
    }) => (newPage) => {
      const {fetchMore} = pagedBlocksResult

      const cursor =
        newPage === getPageCount(totalCount, rowsPerPage) - 1
          ? totalCount
          : rowsPerPage * newPage + rowsPerPage

      // We set auto-update off everytime user changes page (even when he goes to latest one)
      autoUpdate && setAutoUpdate(false)

      // Note: 'fetchMore' is built-in apollo function
      return fetchMore({
        variables: {cursor},
        updateQuery: (prev, {fetchMoreResult, ...rest}) => {
          if (!fetchMoreResult) return prev
          return fetchMoreResult
        },
      }).then(() => setPage(newPage))
    },
  })
)(RecentBlocks)
