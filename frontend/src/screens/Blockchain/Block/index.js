// @flow

import React from 'react'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {withProps} from 'recompose'
import {withRouter} from 'react-router'

import {defineMessages} from 'react-intl'
import {Card} from '@material-ui/core'
import {Link} from 'react-router-dom'

import {routeTo} from '@/helpers/routes'
import {
  EntityIdCard,
  SummaryCard,
  SimpleLayout,
  LoadingInProgress,
  DebugApolloError,
} from '@/components/visual'

import {withI18n} from '@/i18n/helpers'
import {GET_BLOCK_BY_HASH} from '@/api/queries'

const I18N_PREFIX = 'block.fields'

const blockSummaryLabels = defineMessages({
  epoch: {
    id: `${I18N_PREFIX}.epoch`,
    defaultMessage: 'Epoch',
  },
  slot: {
    id: `${I18N_PREFIX}.slot`,
    defaultMessage: 'Slot',
  },
  issuedAt: {
    id: `${I18N_PREFIX}.issuedAt`,
    defaultMessage: 'Timestamp',
  },
  transactionsCount: {
    id: `${I18N_PREFIX}.transactionsCount`,
    defaultMessage: '# Transactions',
  },
})

const TransactionCard = ({transaction}) => (
  <Card>
    <Link to={routeTo.transaction(transaction.txHash)}>{transaction.txHash}</Link>
  </Card>
)

const TransactionList = ({transactions}) => (
  <React.Fragment>
    {transactions && transactions.map((tx) => <TransactionCard key={tx.txHash} transaction={tx} />)}
  </React.Fragment>
)

const _BlockSummaryCard = ({i18n, block}) => {
  const {translate, formatInt, formatTimestamp} = i18n

  const label = blockSummaryLabels

  const Item = ({label, children}) => (
    <SummaryCard.Row>
      <SummaryCard.Label>{translate(label)}</SummaryCard.Label>
      <SummaryCard.Value>{children}</SummaryCard.Value>
    </SummaryCard.Row>
  )

  return (
    <SummaryCard>
      <Item label={label.epoch}>{formatInt(block.epoch)}</Item>
      <Item label={label.slot}>{formatInt(block.slot)}</Item>
      <Item label={label.issuedAt}>{formatTimestamp(block.timeIssued)}</Item>
      <Item label={label.transactionsCount}>{formatInt(block.transactionsCount)}</Item>
    </SummaryCard>
  )
}

const BlockSummaryCard = compose(withI18n)(_BlockSummaryCard)

const blockMessages = defineMessages({
  title: {
    id: 'blockchain.block.title',
    defaultMessage: '<Block>',
  },
  blockHash: {
    id: 'blockchain.block.blockHash',
    defaultMessage: 'Block ID',
  },
})

const Block = ({blockDataProvider, i18n}) => {
  const {loading, block, error} = blockDataProvider
  const {translate} = i18n

  return (
    <SimpleLayout title={translate(blockMessages.title)}>
      {loading ? (
        <LoadingInProgress />
      ) : error ? (
        <DebugApolloError error={error} />
      ) : (
        <React.Fragment>
          <EntityIdCard label={translate(blockMessages.blockHash)} value={block.blockHash} />
          <BlockSummaryCard block={block} />
          <TransactionList transactions={block.transactions} />
        </React.Fragment>
      )}
    </SimpleLayout>
  )
}

export default compose(
  withRouter,
  withProps((props) => ({
    blockHash: props.match.params.blockHash,
  })),
  graphql(GET_BLOCK_BY_HASH, {
    name: 'blockDataProvider',
    options: ({blockHash}) => {
      return {
        variables: {blockHash},
      }
    },
  }),
  withI18n
)(Block)
