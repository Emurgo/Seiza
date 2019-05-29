// @flow
import React, {useState, useRef, useEffect} from 'react'
import {defineMessages} from 'react-intl'
import idx from 'idx'
import {Switch, Typography, Grid, Hidden} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import Pagination, {getPageCount} from '@/components/visual/Pagination'
import {SimpleLayout} from '@/components/visual'
import {GET_PAGED_BLOCKS} from '@/api/queries'
import {useI18n} from '@/i18n/helpers'
import {
  useBlocksTablePagedProps,
  rowsPerPage,
  getTotalItemsCount,
} from '@/components/hooks/useBlocksTablePagedProps'
import {useQueryNotBuggedForBlocks} from '@/components/hooks/useQueryNotBugged'
import {useManageQueryValue} from '@/components/hooks/useManageQueryValue'
import {useScrollFromBottom} from '@/components/hooks/useScrollFromBottom'
import {toIntOrNull} from '@/helpers/utils'
import BlocksTable, {ALL_COLUMNS} from './BlocksTable'
import {useAnalytics} from '@/helpers/googleAnalytics'
import {getPageAndBoundaryFromCursor} from './util'

const AUTOUPDATE_REFRESH_INTERVAL = 20 * 1000

const messages = defineMessages({
  refreshState: 'Refresh state:',
  header: 'Recent blocks',
})

const useAutoUpdateStyles = makeStyles((theme) => ({
  text: {
    textTransform: 'uppercase',
  },
}))

const AutoUpdateSwitch = ({checked, onChange}) => {
  const classes = useAutoUpdateStyles()
  const {translate} = useI18n()
  return (
    <Grid container direction="row" justify="flex-start" alignItems="center">
      <Grid item>
        <Typography className={classes.text}>{translate(messages.refreshState)}&nbsp;</Typography>
      </Grid>
      <Grid item>
        <Switch color="primary" checked={checked} onChange={onChange} />
      </Grid>
    </Grid>
  )
}

const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: '5px 10px',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    },
  },
  bottomPagination: {
    marginTop: theme.spacing.unit * 3,
  },
  upperPagination: {
    marginTop: theme.spacing.unit * 2.5,
    [theme.breakpoints.up('sm')]: {
      marginTop: 0,
    },
  },
}))

const useLoadData = (cursor, autoUpdate) => {
  const dataKey = 'pagedBlocks'

  const {error, loading, data, startPolling, stopPolling} = useQueryNotBuggedForBlocks(
    GET_PAGED_BLOCKS,
    {
      variables: {cursor},
      notifyOnNetworkStatusChange: true,
    }
  )

  autoUpdate ? startPolling(AUTOUPDATE_REFRESH_INTERVAL) : stopPolling()

  const pagedData = idx(data[dataKey], (_) => _.blocks)

  return {
    error,
    loading,
    pagedDataResult: {
      ...data[dataKey],
      pagedData,
    },
  }
}

const PagedBlocks = () => {
  const classes = useStyles()
  const {translate} = useI18n()
  const [page, setPage] = useManageQueryValue('page', null, toIntOrNull)

  const [cursor, setCursor] = useState(null)
  const [autoUpdate, setAutoupdate] = useState(false)

  const {pagedDataResult, loading, error} = useLoadData(cursor, autoUpdate)
  const [totalItemsCount, setTotalItemsCount] = useState(0)

  const [didFirstLoadSetup, setDidFirstLoadSetup] = useState(false)

  const {onChangePage, onChangeAutoUpdate} = useBlocksTablePagedProps(
    page,
    setPage,
    setCursor,
    totalItemsCount,
    setTotalItemsCount,
    autoUpdate,
    setAutoupdate
  )

  // Nothing

  // TODO: consider nicer solution, hot fix for now
  useEffect(() => {
    if (!loading && pagedDataResult.pagedData) {
      const _totalItemsCount = getTotalItemsCount(pagedDataResult)

      // When user reloads page we may need to set autoupdate to True or
      // set cursor based on url
      // Note: we want to do this only once and because of the above condition, this is not
      // moved to run-only-once useEffect hook
      if (!didFirstLoadSetup) {
        const _pageCursor = page * rowsPerPage
        if (_pageCursor >= _totalItemsCount) {
          setAutoupdate(true)
        } else {
          setCursor(page ? Math.min(_totalItemsCount, _pageCursor) : _totalItemsCount)
        }
        setDidFirstLoadSetup(true)
      }

      let _currentPage = page

      if (totalItemsCount === 0 || autoUpdate) {
        // Because pageCount could rise with autoupdate, and we can have old value
        if (autoUpdate) {
          _currentPage = getPageCount(_totalItemsCount, rowsPerPage)
        }
        setTotalItemsCount(_totalItemsCount)
        setPage(_currentPage)
      }
    }
  }, [pagedDataResult.pagedData]) // eslint-disable-line

  const pagedBlocks = pagedDataResult.pagedData

  const analytics = useAnalytics()
  analytics.useTrackPageVisitEvent('blocks')

  const scrollToRef = useRef(null)
  useScrollFromBottom(scrollToRef, pagedBlocks)

  const pagination = (
    <Pagination
      count={totalItemsCount}
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={onChangePage}
      reverseDirection
    />
  )

  const {nextPageNumber, pageBoundary} = getPageAndBoundaryFromCursor(
    pagedDataResult && pagedDataResult.cursor,
    rowsPerPage
  )

  return (
    <div ref={scrollToRef}>
      <SimpleLayout title={translate(messages.header)}>
        <Grid className={classes.wrapper} container alignItems="center" justify="space-between">
          <Grid item>
            <AutoUpdateSwitch checked={autoUpdate} onChange={onChangeAutoUpdate} />
          </Grid>
          <Grid item className={classes.upperPagination}>
            <Pagination
              count={totalItemsCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={onChangePage}
              reverseDirection
            />
          </Grid>
        </Grid>
        <BlocksTable
          {...{
            loading,
            error,
            nextPageNumber,
            pageBoundary,
          }}
          blocks={pagedBlocks}
          columns={ALL_COLUMNS}
        />
        {pagedBlocks && (
          <Hidden mdUp>
            <Grid item className={classes.bottomPagination}>
              {pagination}
            </Grid>
          </Hidden>
        )}
      </SimpleLayout>
    </div>
  )
}

export default PagedBlocks
