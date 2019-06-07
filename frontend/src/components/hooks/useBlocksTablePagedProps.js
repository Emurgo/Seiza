// @flow

// Note!!!: pages are numbered from 1 so that urls is consistent with the rest of UI

import {useCallback, useEffect} from 'react'
import {getPageCount} from '@/components/visual/Pagination'

// TODO: for now `PAGE_SIZE` is hardcoded both in client and server
const PAGE_SIZE = 10

export const rowsPerPage = PAGE_SIZE

export const getTotalItemsCount = (pagedDataResult: {cursor: number, pagedData: Array<{}>}) => {
  const {cursor, pagedData} = pagedDataResult
  const dataCount = pagedData.length
  return dataCount + cursor
}

// TODO: any better name for this?
export const useBlocksTablePagedProps = (
  page: ?number,
  setPage: Function,
  setCursor: Function,
  totalCount: number,
  setTotalCount: Function,
  autoUpdate?: boolean,
  setAutoUpdate: Function
) => {
  const rowsPerPage = PAGE_SIZE

  // Enable autoupdate when user reset `page` by clicking on navigation link (reset page to null)
  // Also reset cursor so we load newest data
  useEffect(() => {
    if (setAutoUpdate && page == null && !autoUpdate) {
      setAutoUpdate(true)
      setCursor(null)
    }
  }, [setAutoUpdate, page, autoUpdate, setCursor])

  // Set `page` after when it is `null` and we have `totalCount`
  useEffect(() => {
    totalCount && page == null && setPage(getPageCount(totalCount, rowsPerPage))
  }, [page, setPage, rowsPerPage, totalCount])

  const onChangeAutoUpdate = useCallback(
    (event: any) => {
      const newAutoUpdate = event.target.checked
      setAutoUpdate(newAutoUpdate)
      newAutoUpdate && setCursor(null)
      newAutoUpdate && setPage(null)
    },
    [setAutoUpdate, setCursor, setPage]
  )

  const onChangePage = useCallback(
    (newPage: number) => {
      const cursor =
        newPage === getPageCount(totalCount, rowsPerPage)
          ? totalCount
          : rowsPerPage * (newPage - 1) + rowsPerPage

      // We set auto-update off everytime user changes page (even when he goes to latest one)
      autoUpdate && setAutoUpdate(false)

      setPage(newPage)
      setCursor(cursor)
    },
    [totalCount, rowsPerPage, autoUpdate, setAutoUpdate, setPage, setCursor]
  )

  return {onChangePage, rowsPerPage, onChangeAutoUpdate}
}
