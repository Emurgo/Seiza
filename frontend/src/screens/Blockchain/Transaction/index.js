// @flow
import React, {useRef} from 'react'
import {useQuery} from 'react-apollo-hooks'
import useReactRouter from 'use-react-router'
import {defineMessages} from 'react-intl'
import idx from 'idx'
import gql from 'graphql-tag'

import {MetadataOverrides, seoMessages} from '@/pages/_meta'
import {extractError} from '@/helpers/errors'
import env from '@/config'
import {useScrollFromBottom} from '@/components/hooks/useScrollFromBottom'
import {SummaryCard, SimpleLayout, LoadingInProgress, Overlay} from '@/components/visual'
import {AdaValue, LoadingError, LoadingOverlay, EntityIdCard, Link} from '@/components/common'
import AddressesBreakdown from '@/components/common/AddressesBreakdown'
import AssuranceChip from '@/components/common/AssuranceChip'

import {ASSURANCE_LEVELS_VALUES, APOLLO_CACHE_OPTIONS} from '@/constants'
import {useI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'
import {useAnalytics} from '@/components/context/googleAnalytics'
import CertificateActions from './CertificateActions'
import MOCKED_CERT_ACTIONS from '@/screens/Blockchain/Certificates/mockedActions'

const messages = defineMessages({
  header: 'Transaction',
  transactionId: 'Transaction Id',
  assuranceLevel: 'Assurance Level:',
  confirmations:
    '{count, plural, =0 {# confirmations} one {# confirmation} other {# confirmations}}',
  epoch: 'Epoch:',
  slot: 'Slot:',
  date: 'Date:',
  fees: 'Transaction Fees:',
  notAvailable: 'N/A',
})

const metadata = defineMessages({
  screenTitle: 'Cardano Transaction {txHash}  | Seiza',
  metaDescription: 'Cardano Transaction: {txHash}. Total ADA Sent: {totalAdaSent}. Date: {date}',
  keywords: 'Transaction {txHash}, Cardano Transactions, {commonKeywords}',
})

type AssuranceEnum = 'LOW' | 'MEDIUM' | 'HIGH'
const assuranceFromConfirmations = (cnt: number): AssuranceEnum => {
  if (cnt < ASSURANCE_LEVELS_VALUES.LOW) {
    return 'LOW'
  } else if (cnt < ASSURANCE_LEVELS_VALUES.MEDIUM) {
    return 'MEDIUM'
  } else {
    return 'HIGH'
  }
}

const TransactionSummary = ({loading, transaction}) => {
  const {translate, formatInt, formatTimestamp} = useI18n()

  const NA = translate(messages.notAvailable)

  const Item = ({label, children}) => (
    <SummaryCard.Row>
      <SummaryCard.Label>{translate(label)}</SummaryCard.Label>
      <SummaryCard.Value>{children}</SummaryCard.Value>
    </SummaryCard.Row>
  )

  const __ = {
    epochNumber: idx(transaction, (_) => _.block.epoch),
    slot: idx(transaction, (_) => _.block.slot),
    blockHash: idx(transaction, (_) => _.block.blockHash),
    confirmations: idx(transaction, (_) => _.confirmationsCount),
    timeIssued: idx(transaction, (_) => _.block.timeIssued),
    fees: idx(transaction, (_) => _.fees),
  }

  const data = {
    assuranceBadge:
      __.confirmations != null ? (
        <AssuranceChip level={assuranceFromConfirmations(__.confirmations)} />
      ) : null,
    confirmations:
      __.confirmations != null
        ? translate(messages.confirmations, {
          count: __.confirmations,
        })
        : NA,
    epoch:
      __.epochNumber != null ? (
        // $FlowFixMe flow does not understand idx precondition
        <Link to={routeTo.epoch(__.epochNumber)}>{formatInt(__.epochNumber)}</Link>
      ) : (
        NA
      ),
    slot:
      __.blockHash != null ? (
        // $FlowFixMe flow does not understand idx precondition
        <Link to={routeTo.block(__.blockHash)}>{formatInt(__.slot)}</Link>
      ) : (
        NA
      ),
    date: formatTimestamp(__.timeIssued, {
      defaultValue: NA,
      format: formatTimestamp.FMT_MONTH_NUMERAL,
    }),
    fees: <AdaValue value={__.fees} noValue={NA} showCurrency timestamp={__.timeIssued} />,
  }

  return (
    <Overlay.Wrapper>
      <SummaryCard>
        <Item label={messages.assuranceLevel}>
          <span>
            {data.assuranceBadge} {data.confirmations}
          </span>
        </Item>
        <Item label={messages.epoch}>{data.epoch}</Item>
        <Item label={messages.slot}>{data.slot}</Item>
        <Item label={messages.date}>{data.date}</Item>
        <Item label={messages.fees}>{data.fees}</Item>
      </SummaryCard>
      <LoadingOverlay loading={loading} />
    </Overlay.Wrapper>
  )
}

const useTransactionData = (txHash) => {
  const {loading, error, data} = useQuery(
    gql`
      query($txHash: String!) {
        transaction(txHash: $txHash) {
          txHash
          block {
            timeIssued
            blockHeight
            epoch
            slot
            blockHash
          }
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
      }
    `,
    {
      variables: {txHash},
      fetchPolicy: APOLLO_CACHE_OPTIONS.CACHE_AND_NETWORK,
    }
  )
  return {loading, error: extractError(error, ['transaction']), transactionData: data.transaction}
}

const useScreenParams = () => {
  const {
    match: {
      params: {txHash},
    },
  } = useReactRouter()
  return {txHash}
}

const TransactionMetadata = ({txHash, txData}) => {
  const {translate: tr, formatTimestamp, formatAda} = useI18n()

  const title = tr(metadata.screenTitle, {txHash})

  const description = tr(metadata.metaDescription, {
    txHash,
    date: formatTimestamp(idx(txData, (_) => _.block.timeIssued), {tz: formatTimestamp.TZ_UTC}),
    totalAdaSent: formatAda(idx(txData, (_) => _.totalInput)),
  })

  const keywords = tr(metadata.keywords, {
    txHash,
    commonKeywords: tr(seoMessages.keywords),
  })

  return <MetadataOverrides {...{title, description, keywords}} />
}

const TransactionScreen = () => {
  const {txHash} = useScreenParams()
  const {loading, transactionData, error} = useTransactionData(txHash)
  const {translate} = useI18n()
  const scrollToRef = useRef(null)

  const analytics = useAnalytics()
  analytics.useTrackPageVisitEvent('transaction')

  useScrollFromBottom(scrollToRef, transactionData)

  return (
    <div ref={scrollToRef}>
      <SimpleLayout title={translate(messages.header)}>
        <TransactionMetadata txHash={txHash} txData={transactionData} />
        <EntityIdCard
          label={translate(messages.transactionId)}
          value={txHash}
          iconRenderer={<img alt="" src="/static/assets/icons/transaction-id.svg" />}
        />
        {error ? (
          <LoadingError error={error} />
        ) : (
          <React.Fragment>
            <TransactionSummary loading={loading} transaction={transactionData} />
            {loading ? <LoadingInProgress /> : <AddressesBreakdown tx={transactionData} />}
            {env.showStakingData && <CertificateActions certificateActions={MOCKED_CERT_ACTIONS} />}
          </React.Fragment>
        )}
      </SimpleLayout>
    </div>
  )
}

export default TransactionScreen
