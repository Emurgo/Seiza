// @flow

import React, {useRef} from 'react'
import {makeStyles} from '@material-ui/styles'
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
  Link,
} from '@/components/visual'

import blockIcon from '@/assets/icons/metrics-blocks.svg'
import {useScrollFromBottom} from '@/components/hooks/useScrollFromBottom'
import {useAnalytics} from '@/helpers/googleAnalytics'

import TransactionCard from '@/components/common/TransactionCard'

import {useI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'
import {extractError} from '@/helpers/errors'
import SlotNavigation from './SlotNavigation'

import {APOLLO_CACHE_OPTIONS} from '@/constants'

const blockSummaryLabels = defineMessages({
  epoch: 'Epoch',
  slot: 'Slot',
  issuedAt: 'Timestamp',
  transactionsCount: 'Transactions',
  blockHeight: 'Block Height',
  totalFees: 'Total Fees',
  totalSent: 'Total ADA Sent',
})

const useStyles = makeStyles((theme) => ({
  transactionList: {
    '& > :not(:first-child)': {
      marginTop: theme.spacing(1.25),
    },
  },
}))

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

  const __ = {
    epochNumber: idx(blockData, (_) => _.epoch),
    slot: idx(blockData, (_) => _.slot),
    blockHash: idx(blockData, (_) => _.blockHash),
    issuedAt: idx(blockData, (_) => _.timeIssued),
    txCount: idx(blockData, (_) => _.transactionsCount),
    blockHeight: idx(blockData, (_) => _.blockHeight),
    totalSent: idx(blockData, (_) => _.totalSent),
    totalFees: idx(blockData, (_) => _.totalFees),
  }

  const data = {
    epoch:
      __.epochNumber != null ? (
        // $FlowFixMe flow does not understand idx precondition
        <Link to={routeTo.epoch(__.epochNumber)}>{formatInt(__.epochNumber)}</Link>
      ) : (
        NA
      ),
    slot: formatInt(__.slot, {defaultValue: NA}), // no link, because it would be link to this page
    issuedAt: formatTimestamp(__.issuedAt, {defaultValue: NA}),
    txCount: formatInt(__.txCount, {defaultValue: NA}),
    blockHeight: formatInt(__.blockHeight, {defaultValue: NA}),
    totalSent: <AdaValue value={__.totalSent} noValue={NA} showCurrency timestamp={__.issuedAt} />,
    totalFees: <AdaValue value={__.totalFees} noValue={NA} showCurrency timestamp={__.issuedAt} />,
  }

  return (
    <SummaryCard>
      <Item label={label.epoch}>{data.epoch}</Item>
      <Item label={label.slot}>{data.slot}</Item>
      <Item label={label.issuedAt}>{data.issuedAt}</Item>
      <Item label={label.transactionsCount}>{data.txCount}</Item>
      <Item label={label.blockHeight}>{data.blockHeight}</Item>
      <Item label={label.totalFees}>{data.totalFees}</Item>
      <Item label={label.totalSent}>{data.totalSent}</Item>
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
    totalSent
    size
    blockLeader {
      poolHash
      name
    }
    totalFees
    blockHeight
    previousBlock {
      blockHash
    }
    nextBlock {
      blockHash
    }
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
      fetchPolicy: APOLLO_CACHE_OPTIONS.CACHE_AND_NETWORK,
    }
  )
  const {loading, error, data} = result

  return {loading, error: extractError(error, ['block']), blockData: data.block}
}

const transactionMessages = defineMessages({
  value: 'Value:',
  inputsCount: 'Number of Inputs:',
  outputsCount: 'Number of Outputs:',
})

const TransactionList = ({transactions, loading, timestamp}) => {
  const {Row, Label, Value} = SummaryCard
  const {translate: tr, formatInt} = useI18n()
  const classes = useStyles()
  return (
    <div className={classes.transactionList}>
      {loading ? (
        <LoadingInProgress />
      ) : (
        (transactions || []).map((tx) => (
          <TransactionCard key={tx.txHash} txHash={tx.txHash}>
            {/* //TODO: certificate */}
            <Row>
              <Label>{tr(transactionMessages.value)}</Label>
              <Value>
                <AdaValue value={tx.totalInput} showCurrency timestamp={timestamp} />
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

  const analytics = useAnalytics()
  analytics.useTrackPageVisitEvent('block')

  useScrollFromBottom(scrollToRef, blockData)

  return (
    <div ref={scrollToRef}>
      <SimpleLayout title={translate(blockMessages.title)}>
        <SlotNavigation slot={blockData} />
        <EntityIdCard
          label={translate(blockMessages.blockHash)}
          value={blockHash}
          iconRenderer={<img alt="" src={blockIcon} width={40} height={40} />}
        />
        {error ? (
          <LoadingError error={error} />
        ) : (
          <React.Fragment>
            <BlockSummaryCard loading={loading} blockData={blockData} />
            <TransactionList
              loading={loading}
              transactions={idx(blockData, (_) => _.transactions)}
              timestamp={idx(blockData, (_) => _.timeIssued)}
            />
          </React.Fragment>
        )}
      </SimpleLayout>
    </div>
  )
}

export default BlockScreen
