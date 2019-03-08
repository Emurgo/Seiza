// @flow
import React from 'react'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {defineMessages} from 'react-intl'
import {withProps} from 'recompose'
import idx from 'idx'
import {Switch, Typography, Grid, withStyles, createStyles} from '@material-ui/core'

import {onDidUpdate, onDidMount} from '@/components/HOC/lifecycles'
import Pagination, {getPageCount} from '@/components/visual/Pagination'
import {SimpleLayout} from '@/components/visual'
import BlocksTable, {ALL_COLUMNS} from './BlocksTable'
import {GET_PAGED_BLOCKS} from '@/api/queries'
import {useI18n} from '@/i18n/helpers'
import withPagedData from '@/components/HOC/withPagedData'

const I18N_PREFIX = 'blockchain.blockList'

const messages = defineMessages({
  refreshState: {
    id: `${I18N_PREFIX}.refreshState`,
    defaultMessage: 'Refresh state:',
  },
  header: {
    id: `${I18N_PREFIX}.header`,
    defaultMessage: 'Recent blocks',
  },
})

const autoUpdateStyles = (theme) =>
  createStyles({
    text: {
      textTransform: 'uppercase',
    },
  })

const AutoUpdateSwitch = compose(withStyles(autoUpdateStyles))(({checked, onChange, classes}) => {
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
})

const styles = (theme) =>
  createStyles({
    wrapper: {
      padding: '5px 10px',
    },
  })

const PagedBlocks = (props) => {
  const {
    pagedDataResult: {loading, error, pagedData: pagedBlocks},
    classes,
  } = props
  const {translate} = useI18n()
  return (
    <SimpleLayout title={translate(messages.header)}>
      <Grid
        className={classes.wrapper}
        container
        direction="row"
        alignItems="center"
        justify="space-between"
      >
        <Grid item>
          <AutoUpdateSwitch checked={props.autoUpdate} onChange={props.onChangeAutoUpdate} />
        </Grid>
        <Grid item>
          <Pagination
            count={props.totalCount}
            rowsPerPage={props.rowsPerPage}
            page={props.page}
            onChangePage={props.onChangePage}
            reverseDirection
          />
        </Grid>
      </Grid>
      <BlocksTable
        loading={loading}
        error={error}
        blocks={pagedBlocks && pagedBlocks.blocks}
        columns={ALL_COLUMNS}
      />
    </SimpleLayout>
  )
}

const AUTOUPDATE_REFRESH_INTERVAL = 10 * 1000
const AUTOUPDATE_REFRESH_INTERVAL_OFF = 0
const withData = compose(
  graphql(GET_PAGED_BLOCKS, {
    name: 'pagedDataResult',
    // $FlowFixMe somehow notifyOnNetworkStatusChange is missing in typedef
    options: (props) => ({
      variables: {cursor: props.cursor},
      pollInterval: props.autoUpdate
        ? AUTOUPDATE_REFRESH_INTERVAL
        : AUTOUPDATE_REFRESH_INTERVAL_OFF,
      notifyOnNetworkStatusChange: true,
    }),
  }),
  withProps(({pagedDataResult}) => ({
    pagedDataResult: {
      ...pagedDataResult,
      pagedData: idx(pagedDataResult, (_) => _.pagedBlocks),
    },
  }))
)

const _updateTotalPageCount = ({pagedDataResult, rowsPerPage, setTotalCount, setPage}) => {
  const blocksCount = idx(pagedDataResult, (_) => _.pagedData.blocks.length)
  if (blocksCount) {
    const itemsCount = blocksCount + pagedDataResult.pagedData.cursor
    setTotalCount(itemsCount)
    setPage(getPageCount(itemsCount, rowsPerPage) - 1)
  }
}

const withSetTotalPageCount = compose(
  onDidMount(_updateTotalPageCount),
  onDidUpdate((props, prevProps) => {
    if (
      (props.autoUpdate &&
        prevProps.pagedDataResult.pagedData !== props.pagedDataResult.pagedData) ||
      !props.totalCount
    ) {
      _updateTotalPageCount(props)
    }
  })
)

export default compose(
  withStyles(styles),
  withPagedData({withData, withSetTotalPageCount, initialAutoUpdate: true})
)(PagedBlocks)
