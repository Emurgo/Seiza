// @flow
import React, {useState, useRef} from 'react'
import {defineMessages} from 'react-intl'
import idx from 'idx'
import {Switch, Typography, Grid, Hidden} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import Pagination from '@/components/visual/Pagination'
import {SimpleLayout} from '@/components/visual'
import {GET_PAGED_BLOCKS} from '@/api/queries'
import {useI18n} from '@/i18n/helpers'
import {
  useBlocksTablePagedProps,
  useTotalItemsCount,
} from '@/components/hooks/useBlocksTablePagedProps'
import {useQueryNotBugged} from '@/components/hooks/useQueryNotBugged'
import {useManageQueryValue} from '@/components/hooks/useManageQueryValue'
import {useScrollFromBottom} from '@/components/hooks/useScrollFromBottom'
import {toIntOrNull} from '@/helpers/utils'
import BlocksTable, {ALL_COLUMNS} from './BlocksTable'
import {useAnalytics} from '@/helpers/googleAnalytics'

const AUTOUPDATE_REFRESH_INTERVAL = 10 * 1000

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

  const {error, loading, data, startPolling, stopPolling} = useQueryNotBugged(GET_PAGED_BLOCKS, {
    variables: {cursor},
    notifyOnNetworkStatusChange: true,
    shouldInvalidatePreviousData: autoUpdate,
  })

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
  const [autoUpdate, setAutoupdate] = useState(true)

  const {pagedDataResult, loading, error} = useLoadData(cursor, autoUpdate)
  const [totalItemsCount, setTotalItemsCount] = useTotalItemsCount(pagedDataResult, autoUpdate)

  const {onChangePage, rowsPerPage, onChangeAutoUpdate} = useBlocksTablePagedProps(
    page,
    setPage,
    setCursor,
    totalItemsCount,
    setTotalItemsCount,
    autoUpdate,
    setAutoupdate
  )

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
        <BlocksTable loading={loading} error={error} blocks={pagedBlocks} columns={ALL_COLUMNS} />
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
