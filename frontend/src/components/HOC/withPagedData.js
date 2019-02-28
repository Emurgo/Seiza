import {compose} from 'redux'
import {withProps, withHandlers, withStateHandlers} from 'recompose'
import {getPageCount} from '@/components/visual/Pagination'

// TODO: for now `PAGE_SIZE` is hardcoded both in client and server
const PAGE_SIZE = 10

export default ({withData, withSetTotalPageCount, initialAutoUpdate = true}) =>
  compose(
    withProps(() => ({
      rowsPerPage: PAGE_SIZE,
    })),
    withStateHandlers(
      {page: 0, totalCount: 0, autoUpdate: initialAutoUpdate},
      {
        setPage: () => (page) => ({page}),
        setTotalCount: () => (totalCount) => ({totalCount}),
        setAutoUpdate: () => (autoUpdate) => ({autoUpdate}),
      }
    ),
    withData,
    withSetTotalPageCount,
    withHandlers({
      onChangeAutoUpdate: ({setAutoUpdate, pagedDataResult}) => (event) => {
        const checked = event.target.checked
        setAutoUpdate(checked)
        checked && pagedDataResult.refetch()
      },
      onChangePage: ({
        setPage,
        totalCount,
        pagedDataResult,
        rowsPerPage,
        setAutoUpdate,
        autoUpdate,
      }) => (newPage) => {
        const {fetchMore} = pagedDataResult

        const cursor =
          newPage === getPageCount(totalCount, rowsPerPage) - 1
            ? totalCount
            : rowsPerPage * newPage + rowsPerPage

        // We set auto-update off everytime user changes page (even when he goes to latest one)
        autoUpdate && setAutoUpdate(false)

        setPage(newPage)

        // Note: 'fetchMore' is built-in apollo function
        return fetchMore({
          variables: {cursor},
          updateQuery: (prev, {fetchMoreResult, ...rest}) => {
            if (!fetchMoreResult) return prev
            return fetchMoreResult
          },
        })
      },
    })
  )
