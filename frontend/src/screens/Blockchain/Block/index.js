// @flow

import React, {useRef, useState, useCallback} from 'react'
import {useQuery} from 'react-apollo-hooks'
import {compose} from 'redux'
import {withProps} from 'recompose'
import {withRouter} from 'react-router'
import gql from 'graphql-tag'

import {defineMessages} from 'react-intl'

import {routeTo} from '@/helpers/routes'
import {
  EntityIdCard,
  SummaryCard,
  SimpleLayout,
  LoadingInProgress,
  DebugApolloError,
  Link,
  AdaValue,
  ExpansionPanel,
  EntityCardContent,
} from '@/components/visual'

import {useI18n} from '@/i18n/helpers'

const blockSummaryLabels = defineMessages({
  epoch: 'Epoch',
  slot: 'Slot',
  issuedAt: 'Timestamp',
  transactionsCount: '# Transactions',
})

const transactionMessages = defineMessages({
  transactionId: 'Transacton Id:',
  value: 'Value:',
  inputsCount: 'Number of Inputs:',
  outputsCount: 'Number of Outputs:',
})

const TransactionCard = ({transaction}) => {
  const entityRef = useRef(null)
  const [expanded, setExpanded] = useState(false)
  const onChange = useCallback(
    (event) => {
      entityRef.current && !entityRef.current.contains(event.target) && setExpanded(!expanded)
    },
    [expanded, entityRef]
  )
  const {translate: tr, formatInt} = useI18n()
  const {Row, Label, Value} = SummaryCard
  return (
    <ExpansionPanel
      expanded={expanded}
      onChange={onChange}
      summary={
        <EntityCardContent
          label={tr(transactionMessages.transactionId)}
          innerRef={entityRef}
          value={<Link to={routeTo.transaction(transaction.txHash)}>{transaction.txHash}</Link>}
        />
      }
    >
      {/* //TODO: certificate */}
      <Row>
        <Label>{tr(transactionMessages.value)}</Label>
        <Value>
          <AdaValue value={transaction.totalInput} showCurrency />
        </Value>
      </Row>
      <Row>
        <Label>{tr(transactionMessages.inputsCount)}</Label>
        <Value>{formatInt(transaction.inputs.length)}</Value>
      </Row>
      <Row>
        <Label>{tr(transactionMessages.outputsCount)}</Label>
        <Value>{formatInt(transaction.outputs.length)}</Value>
      </Row>
    </ExpansionPanel>
  )
}

const TransactionList = ({transactions}) => (
  <div>
    {transactions && transactions.map((tx) => <TransactionCard key={tx.txHash} transaction={tx} />)}
  </div>
)

const BlockSummaryCard = ({block}) => {
  const {translate, formatInt, formatTimestamp} = useI18n()

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

const blockMessages = defineMessages({
  title: '<Block>',
  blockHash: 'Block ID',
})

const BLOCK_INFO_FRAGMENT = gql`
  fragment BlockInfo on Block {
    blockHash
    epoch
    slot
    timeIssued
    transactionsCount
    totalSend
    size
    blockLeader {
      poolHash
      name
    }
    totalFees
  }
`

const TX_INFO_FRAGMENT = gql`
  fragment BasicTxInfo on Transaction {
    txHash
    totalInput
    totalOutput
    fees
    inputs {
      address58
      amount
    }
    outputs {
      address58
      amount
    }
    confirmationsCount
  }
`

const useBlockData = ({blockHash}) => {
  const result = useQuery(
    gql`
      query($blockHash: String!) {
        block(blockHash: $blockHash) {
          ...BlockInfo
          transactions {
            ...BasicTxInfo
          }
        }
      }
      ${TX_INFO_FRAGMENT}
      ${BLOCK_INFO_FRAGMENT}
    `,
    {
      variables: {blockHash},
    }
  )
  const {loading, error, data} = result

  return {loading, error, block: data.block}
}

const Block = ({blockHash}) => {
  const {loading, block, error} = useBlockData({blockHash})
  const {translate} = useI18n()

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
  }))
)(Block)
