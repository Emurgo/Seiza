// @flow

import React, {useRef} from 'react'
import {useQuery} from 'react-apollo-hooks'
import useReactRouter from 'use-react-router'
import idx from 'idx'
import gql from 'graphql-tag'

import {defineMessages} from 'react-intl'

import {
  EntityIdCard,
  SummaryCard,
  SimpleLayout,
  LoadingDots,
  LoadingInProgress,
  LoadingError,
  AdaValue,
} from '@/components/visual'

import {useScrollFromBottom} from '@/components/hooks/useScrollFromBottom'

import TransactionCard from '@/components/common/TransactionCard'

import {useI18n} from '@/i18n/helpers'

const blockSummaryLabels = defineMessages({
  epoch: 'Epoch',
  slot: 'Slot',
  issuedAt: 'Timestamp',
  transactionsCount: '# Transactions',
})

const BlockSummaryCard = ({blockData, loading}) => {
  const {translate, formatInt, formatTimestamp} = useI18n()

  const label = blockSummaryLabels

  const Item = ({label, children}) => (
    <SummaryCard.Row>
      <SummaryCard.Label>{translate(label)}</SummaryCard.Label>
      <SummaryCard.Value>{children}</SummaryCard.Value>
    </SummaryCard.Row>
  )

  const NA = loading ? <LoadingDots /> : 'N/A'

  const data = {
    epoch: formatInt(idx(blockData, (_) => _.epoch), {defaultValue: NA}),
    slot: formatInt(idx(blockData, (_) => _.slot), {defaultValue: NA}),
    issuedAt: formatTimestamp(idx(blockData, (_) => _.timeIssued), {defaultValue: NA}),
    txCount: formatInt(idx(blockData, (_) => _.transactionsCount), {defaultValue: NA}),
  }

  return (
    <SummaryCard>
      <Item label={label.epoch}>{data.epoch}</Item>
      <Item label={label.slot}>{data.slot}</Item>
      <Item label={label.issuedAt}>{data.issuedAt}</Item>
      <Item label={label.transactionsCount}>{data.txCount}</Item>
    </SummaryCard>
  )
}

const blockMessages = defineMessages({
  title: 'Block',
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

  return {loading, error, blockData: data.block}
}

const transactionMessages = defineMessages({
  value: 'Value:',
  inputsCount: 'Number of Inputs:',
  outputsCount: 'Number of Outputs:',
})

const TransactionList = ({transactions, loading}) => {
  const {Row, Label, Value} = SummaryCard
  const {translate: tr, formatInt} = useI18n()
  return (
    <div>
      {loading ? (
        <LoadingInProgress />
      ) : (
        (transactions || []).map((tx) => (
          <TransactionCard key={tx.txHash} txHash={tx.txHash}>
            {/* //TODO: certificate */}
            <Row>
              <Label>{tr(transactionMessages.value)}</Label>
              <Value>
                <AdaValue value={tx.totalInput} showCurrency />
              </Value>
            </Row>
            <Row>
              <Label>{tr(transactionMessages.inputsCount)}</Label>
              <Value>{formatInt(tx.inputs.length)}</Value>
            </Row>
            <Row>
              <Label>{tr(transactionMessages.outputsCount)}</Label>
              <Value>{formatInt(tx.outputs.length)}</Value>
            </Row>
          </TransactionCard>
        ))
      )}
    </div>
  )
}

const BlockScreen = () => {
  const {
    match: {
      params: {blockHash},
    },
  } = useReactRouter()
  const {loading, blockData, error} = useBlockData({blockHash})
  const {translate} = useI18n()
  const scrollToRef = useRef()

  useScrollFromBottom(scrollToRef, blockData)

  return (
    <div ref={scrollToRef}>
      <SimpleLayout title={translate(blockMessages.title)}>
        <EntityIdCard label={translate(blockMessages.blockHash)} value={blockHash} />
        {error ? (
          <LoadingError error={error} />
        ) : (
          <React.Fragment>
            <BlockSummaryCard loading={loading} blockData={blockData} />
            <TransactionList
              loading={loading}
              transactions={idx(blockData, (_) => _.transactions)}
            />
          </React.Fragment>
        )}
      </SimpleLayout>
    </div>
  )
}

export default BlockScreen
