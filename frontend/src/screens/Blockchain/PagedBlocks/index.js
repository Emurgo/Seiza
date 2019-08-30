// @flow
import React, {useRef, useCallback, useState, useEffect} from 'react'
import {defineMessages} from 'react-intl'
import {Switch, Typography, Grid, Hidden} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {Pagination, MobilePaginationDivider} from '@/components/common'
import {SimpleLayout} from '@/components/visual'
import {GET_PAGED_BLOCKS} from '@/api/queries'
import {useI18n} from '@/i18n/helpers'
import {useQueryNotBugged} from '@/components/hooks/useQueryNotBugged'
import {useManageQueryValue} from '@/components/hooks/useManageQueryValue'
import {useScrollFromBottom} from '@/components/hooks/useScrollFromBottom'
import {toIntOrNull, getPageCount} from '@/helpers/utils'
import BlocksTable, {ALL_COLUMNS} from './BlocksTable'
import {useAnalytics} from '@/components/context/googleAnalytics'
import {getPageAndBoundaryFromCursor} from './util'
import {useIsBreakpointDown} from '@/components/hooks/useBreakpoints'

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
    <Grid container direction="row" justify="flex-start" alignItems="center" className="w-auto">
      <Grid item>
        <Typography className={classes.text} color="textSecondary">
          {translate(messages.refreshState)}&nbsp;
        </Typography>
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
    marginTop: theme.spacing(3),
  },
  upperPagination: {
    marginTop: theme.spacing(2.5),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginTop: 0,
      width: 'auto',
    },
  },
}))

const useLoadData = (cursor, autoUpdate) => {
  const {error, loading, data, startPolling, stopPolling} = useQueryNotBugged(GET_PAGED_BLOCKS, {
    variables: {cursor},
    notifyOnNetworkStatusChange: true,
  })

  autoUpdate ? startPolling(AUTOUPDATE_REFRESH_INTERVAL) : stopPolling()

  return {
    error,
    loading,
    data: data.pagedBlocks,
  }
}

// TODO: for now `PAGE_SIZE` is hardcoded both in client and server
const PAGE_SIZE = 10
const rowsPerPage = PAGE_SIZE

const usePagedBlocks = () => {
  const [page, setPage] = useManageQueryValue('page', null, toIntOrNull)
  const [totalCount, setTotalCount] = useState(0)
  const autoUpdate = page == null

  const {data: pagedDataResult, loading, error} = useLoadData(
    page == null ? null : page * rowsPerPage,
    autoUpdate
  )

  const {totalCount: dataTotalCount, blocks: pagedBlocks} = pagedDataResult || {}

  useEffect(() => {
    if (dataTotalCount > totalCount) setTotalCount(dataTotalCount)
  }, [totalCount, dataTotalCount])

  const effectivePage = page == null ? Math.ceil(totalCount / rowsPerPage) : page

  const onChangeAutoUpdate = useCallback(
    (evt) => {
      const checked = evt.target.checked
      if (checked) {
        setPage(null)
      } else {
        setPage(effectivePage)
      }
    },
    [effectivePage, setPage]
  )

  return {
    page,
    effectivePage,
    setPage,
    totalCount: totalCount || 0,
    pagedBlocks,
    autoUpdate,
    onChangeAutoUpdate,
    loading,
    error,
    nextPageCursor: pagedDataResult && pagedDataResult.cursor,
  }
}

const PagedBlocks = () => {
  const classes = useStyles()
  const {translate} = useI18n()
  const analytics = useAnalytics()
  const isSmScreen = useIsBreakpointDown('sm')
  analytics.useTrackPageVisitEvent('blocks')

  const {
    pagedBlocks,
    setPage,
    effectivePage,
    totalCount,
    autoUpdate,
    onChangeAutoUpdate,
    nextPageCursor,
    loading,
    error,
  } = usePagedBlocks()
  const scrollToRef = useRef(null)
  useScrollFromBottom(scrollToRef, pagedBlocks)

  const pagination = (
    <Pagination
      pageCount={getPageCount(totalCount, rowsPerPage)}
      page={effectivePage}
      onChangePage={setPage}
      reverseDirection
    />
  )

  const {nextPageNumber, pageBoundary} = getPageAndBoundaryFromCursor(nextPageCursor, rowsPerPage)

  return (
    <div ref={scrollToRef}>
      <SimpleLayout title={translate(messages.header)}>
        <Grid className={classes.wrapper} container alignItems="center" justify="space-between">
          <AutoUpdateSwitch checked={autoUpdate} onChange={onChangeAutoUpdate} />

          <div className={classes.upperPagination}>
            {isSmScreen && <MobilePaginationDivider />}
            {pagination}
          </div>
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
