// @flow
import React from 'react'
import idx from 'idx'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {withHandlers, withStateHandlers, withProps} from 'recompose'
import {defineMessages} from 'react-intl'
import {Switch, Typography, Grid, withStyles, createStyles} from '@material-ui/core'

import Pagination, {getPageCount} from '../../../components/visual/Pagination'
import {SimpleLayout, LoadingInProgress, DebugApolloError} from '@/components/visual'
import BlocksTable from './BlocksTable'
import {onDidUpdate, onDidMount} from '../../../components/HOC/lifecycles'
import {GET_PAGED_BLOCKS} from '../../../api/queries'
import {withI18n} from '../../../i18n/helpers'

// TODO: for now `PAGE_SIZE` is hardcoded both in client and server
const PAGE_SIZE = 10
const AUTOUPDATE_REFRESH_INTERVAL = 10 * 1000
const AUTOUPDATE_REFRESH_INTERVAL_OFF = 0

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

const withBlocks = graphql(GET_PAGED_BLOCKS, {
  name: 'pagedBlocksResult',
  options: (props) => ({
    variables: {cursor: props.cursor},
    pollInterval: props.autoUpdate ? AUTOUPDATE_REFRESH_INTERVAL : AUTOUPDATE_REFRESH_INTERVAL_OFF,
  }),
})

const autoUpdateStyles = (theme) =>
  createStyles({
    text: {
      textTransform: 'uppercase',
    },
  })

const AutoUpdateSwitch = compose(
  withStyles(autoUpdateStyles),
  withI18n
)(({checked, onChange, classes, i18n: {translate}}) => (
  <Grid container direction="row" justify="flex-start" alignItems="center">
    <Grid item>
      <Typography className={classes.text}>{translate(messages.refreshState)}&nbsp;</Typography>
    </Grid>
    <Grid item>
      <Switch color="primary" checked={checked} onChange={onChange} />
    </Grid>
  </Grid>
))

const styles = (theme) =>
  createStyles({
    wrapper: {
      padding: '5px 10px',
    },
  })

const RecentBlocks = (props) => {
  const {
    pagedBlocksResult: {loading, error, pagedBlocks},
    classes,
    i18n: {translate},
  } = props
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
      {loading ? (
        <LoadingInProgress />
      ) : error ? (
        <DebugApolloError error={error} />
      ) : (
        <BlocksTable blocks={pagedBlocks.blocks} />
      )}
    </SimpleLayout>
  )
}

const _updateTotalCount = ({pagedBlocksResult, rowsPerPage, setTotalCount, setPage}) => {
  const blocksCount = idx(pagedBlocksResult, (_) => _.pagedBlocks.blocks.length)
  if (blocksCount) {
    const itemsCount = blocksCount + pagedBlocksResult.pagedBlocks.cursor
    setTotalCount(itemsCount)
    setPage(getPageCount(itemsCount, rowsPerPage) - 1)
  }
}

export default compose(
  withStyles(styles),
  withI18n,
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
  onDidMount(_updateTotalCount),
  onDidUpdate((props, prevProps) => {
    if (
      (props.autoUpdate &&
        prevProps.pagedBlocksResult.pagedBlocks !== props.pagedBlocksResult.pagedBlocks) ||
      !props.totalCount
    ) {
      _updateTotalCount(props)
    }
  }),
  withHandlers({
    onChangeAutoUpdate: ({setAutoUpdate, pagedBlocksResult}) => (event) => {
      const checked = event.target.checked
      setAutoUpdate(checked)
      checked && pagedBlocksResult.refetch()
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
