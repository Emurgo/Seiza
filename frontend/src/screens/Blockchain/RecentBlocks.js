// @flow
import React from 'react'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {withHandlers} from 'recompose'
import {injectIntl, defineMessages} from 'react-intl'
import {withStyles} from '@material-ui/core/styles'

import {getIntlFormatters} from '../../i18n/helpers'
import Table from '../../components/visual/Table'
import {GET_BLOCKS} from '../../api/queries'

const messages = defineMessages({
  loadMore: {
    id: 'blockchain.blockList.loadMore',
    defaultMessage: 'Load more',
  },
  epoch: {
    id: 'blockchain.blockList.table.epoch',
    defaultMessage: 'epoch',
  },
  slot: {
    id: 'blockchain.blockList.table.slot',
    defaultMessage: 'slot',
  },
  slotLeader: {
    id: 'blockchain.blockList.table.slotLeader',
    defaultMessage: 'slot leader',
  },
  time: {
    id: 'blockchain.blockList.table.time',
    defaultMessage: 'time',
  },
  transactions: {
    id: 'blockchain.blockList.table.transactions',
    defaultMessage: 'transactions',
  },
  totalSent: {
    id: 'blockchain.blockList.table.totalSent',
    defaultMessage: 'total sent (ADA)',
  },
  fees: {
    id: 'blockchain.blockList.table.fees',
    defaultMessage: 'fees (ADA)',
  },
  size: {
    id: 'blockchain.blockList.table.size',
    defaultMessage: 'size (B)',
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

const LinkField = withStyles(linkFieldStyles)(({children, classes}) => (
  <span className={classes.linkField}>{children}</span>
))

const HeaderCell = withStyles(headerCellStyles)(({children, classes}) => (
  <Table.Cell align="left">
    <span className={classes.text}>{children}</span>
  </Table.Cell>
))

const BodyCell = ({children}) => <Table.Cell align="left">{children}</Table.Cell>

// TODO: use some HOC to alter props names?
// TODO: separete component for table
// Note: 'fetchMore' is built-in apollo function
const RecentBlocks = (props) => {
  const {loading, blocks} = props.blocks
  const {translate, formatInt, formatFiat} = getIntlFormatters(props.intl)
  const {onLoadMore} = props
  return (
    <React.Fragment>
      {!loading && (
        <React.Fragment>
          <div>Total count: {blocks.blocks.length} </div>
          <Table>
            <Table.Head>
              <Table.HeadRow>
                <HeaderCell>{translate(messages.epoch)}</HeaderCell>
                <HeaderCell>{translate(messages.slot)}</HeaderCell>
                <HeaderCell>{translate(messages.slotLeader)}</HeaderCell>
                <HeaderCell>{translate(messages.time)}</HeaderCell>
                <HeaderCell>{translate(messages.transactions)}</HeaderCell>
                <HeaderCell>{translate(messages.totalSent)}</HeaderCell>
                <HeaderCell>{translate(messages.fees)}</HeaderCell>
                <HeaderCell>{translate(messages.size)}</HeaderCell>
              </Table.HeadRow>
            </Table.Head>
            <Table.Body>
              {blocks.blocks.map((block) => (
                <Table.Row key={block.blockHash}>
                  <BodyCell>
                    <LinkField>{formatInt(block.epoch)}</LinkField>
                  </BodyCell>
                  <BodyCell>
                    <LinkField>{formatInt(block.slot)}</LinkField>
                  </BodyCell>
                  <BodyCell>
                    <LinkField>{block.blockLead}</LinkField>
                  </BodyCell>
                  <BodyCell>{block.timeIssued}</BodyCell>
                  <BodyCell>{formatInt(block.transactionsCount)}</BodyCell>
                  <BodyCell>{formatFiat(block.totalSend)}</BodyCell>
                  <BodyCell>{formatFiat(block.totalFees)}</BodyCell>
                  <BodyCell>{block.size}</BodyCell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
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
