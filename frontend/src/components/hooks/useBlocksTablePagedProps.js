// @flow

import {useState, useCallback, useEffect} from 'react'
import {getPageCount} from '@/components/visual/Pagination'

// TODO: for now `PAGE_SIZE` is hardcoded both in client and server
const PAGE_SIZE = 10

export const useTotalItemsCount = (pagedDataResult: any, autoUpdate?: boolean) => {
  // $FlowFixMe
  const [totalItemsCount, setTotalItemsCount] = useState(0)
  const {cursor, pagedData} = pagedDataResult

  useEffect(() => {
    if (autoUpdate || totalItemsCount === 0) {
      const dataCount = pagedData && pagedData.length

      if (dataCount) {
        const newTotalItemsCount = dataCount + cursor
        newTotalItemsCount !== totalItemsCount && setTotalItemsCount(newTotalItemsCount)
      }
    }
  }, [autoUpdate, cursor, pagedData, totalItemsCount])

  return [totalItemsCount, setTotalItemsCount]
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
    totalCount && page == null && setPage(getPageCount(totalCount, rowsPerPage) - 1)
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
        newPage === getPageCount(totalCount, rowsPerPage) - 1
          ? totalCount
          : rowsPerPage * newPage + rowsPerPage

      // We set auto-update off everytime user changes page (even when he goes to latest one)
      autoUpdate && setAutoUpdate(false)

      setPage(newPage)
      setCursor(cursor)
    },
    [totalCount, rowsPerPage, autoUpdate, setAutoUpdate, setPage, setCursor]
  )

  return {onChangePage, rowsPerPage, onChangeAutoUpdate}
}
