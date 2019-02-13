// @flow
import React from 'react'
import {Table, TableBody, TableCell, TableHead, TableRow, Paper} from '@material-ui/core'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {withHandlers} from 'recompose'
import {injectIntl, defineMessages} from 'react-intl'
import {Link} from 'react-router-dom'
import {withStyles} from '@material-ui/core/styles'

import {getIntlFormatters} from '../../i18n/helpers'
import {GET_BLOCKS} from '../../api/queries'

const I18N_PREFIX = 'blockchain.blockList'
const TABLE_I18N_PREFIX = `${I18N_PREFIX}.table`

const messages = defineMessages({
  loadMore: {
    id: `${I18N_PREFIX}.loadMore`,
    defaultMessage: 'Load more',
  },
})

const tableMessages = defineMessages({
  epoch: {
    id: `${TABLE_I18N_PREFIX}.epoch`,
    defaultMessage: 'epoch',
  },
  slot: {
    id: `${TABLE_I18N_PREFIX}.slot`,
    defaultMessage: 'slot',
  },
  slotLeader: {
    id: `${TABLE_I18N_PREFIX}.slotLeader`,
    defaultMessage: 'slot leader',
  },
  time: {
    id: `${TABLE_I18N_PREFIX}.time`,
    defaultMessage: 'time',
  },
  transactions: {
    id: `${TABLE_I18N_PREFIX}.transactions`,
    defaultMessage: 'transactions',
  },
  totalSent: {
    id: `${TABLE_I18N_PREFIX}.totalSent`,
    defaultMessage: 'total sent (ADA)',
  },
  fees: {
    id: `${TABLE_I18N_PREFIX}.fees`,
    defaultMessage: 'fees (ADA)',
  },
  size: {
    id: `${TABLE_I18N_PREFIX}.size`,
    defaultMessage: 'size (B)',
  },
})

const tableStyles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
    'cursor': 'pointer',
  },
})

const withBlocks = graphql(GET_BLOCKS, {
  name: 'blocks',
  options: ({cursor}) => ({
    variables: {cursor},
  }),
})

const linkFieldStyles = (theme) => ({
  linkField: {
    color: theme.palette.primary.dark,
  },
})

const headerCellStyles = () => ({
  text: {
    textTransform: 'uppercase',
  },
})

const LinkField = withStyles(linkFieldStyles)(({children, to, classes}) => (
  <Link to={to} className={classes.linkField}>{children}</Link>
))

const HeaderCell = withStyles(headerCellStyles)(({children, classes}) => (
  <TableCell align="left">
    <span className={classes.text}>{children}</span>
  </TableCell>
))

const BodyCell = ({children}) => <TableCell align="left">{children}</TableCell>

// TODO: use formatAda where appropriate
const BlocksTable = compose(
  withStyles(tableStyles),
  injectIntl
)(({blocks, intl, classes}) => {
  const {translate, formatInt} = getIntlFormatters(intl)
  return (
    <Paper className={classes.root}>
      <Table>
        <TableHead>
          <TableRow>
            <HeaderCell>{translate(tableMessages.epoch)}</HeaderCell>
            <HeaderCell>{translate(tableMessages.slot)}</HeaderCell>
            <HeaderCell>{translate(tableMessages.slotLeader)}</HeaderCell>
            <HeaderCell>{translate(tableMessages.time)}</HeaderCell>
            <HeaderCell>{translate(tableMessages.transactions)}</HeaderCell>
            <HeaderCell>{translate(tableMessages.totalSent)}</HeaderCell>
            <HeaderCell>{translate(tableMessages.fees)}</HeaderCell>
            <HeaderCell>{translate(tableMessages.size)}</HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {blocks.map((block) => (
            <TableRow key={block.blockHash} className={classes.row}>
              <BodyCell>
                <LinkField to="/todo">{formatInt(block.epoch)}</LinkField>
              </BodyCell>
              <BodyCell>
                <LinkField to="/todo">{formatInt(block.slot)}</LinkField>
              </BodyCell>
              <BodyCell>
                <LinkField to="/todo">{block.blockLead}</LinkField>
              </BodyCell>
              <BodyCell>{block.timeIssued}</BodyCell>
              <BodyCell>{formatInt(block.transactionsCount)}</BodyCell>
              <BodyCell>{formatInt(block.totalSend)}</BodyCell>
              <BodyCell>{formatInt(block.totalFees)}</BodyCell>
              <BodyCell>{formatInt(block.size)}</BodyCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
})

// TODO: use some HOC to alter props names?
// Note: 'fetchMore' is built-in apollo function
const RecentBlocks = (props) => {
  const {loading, blocks} = props.blocks
  const {translate} = getIntlFormatters(props.intl)
  const {onLoadMore} = props
  return (
    <React.Fragment>
      {!loading && (
        <React.Fragment>
          <div>Total count: {blocks.blocks.length} </div>
          <BlocksTable blocks={blocks.blocks} />
          {blocks.hasMore && <button onClick={onLoadMore}>{translate(messages.loadMore)}</button>}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default compose(
  injectIntl,
  withBlocks,
  withHandlers({
    onLoadMore: (props) => () => {
      const {blocks, fetchMore} = props.blocks
      fetchMore({
        variables: {
          cursor: blocks.cursor,
        },
        updateQuery: (prev, {fetchMoreResult, ...rest}) => {
          if (!fetchMoreResult) return prev
          return {
            ...fetchMoreResult,
            blocks: {
              ...fetchMoreResult.blocks,
              blocks: [...prev.blocks.blocks, ...fetchMoreResult.blocks.blocks],
            },
          }
        },
      })
    },
  })
)(RecentBlocks)
