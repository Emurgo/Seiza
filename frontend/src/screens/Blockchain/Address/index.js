// @flow
import React, {useRef} from 'react'
import {useQuery} from 'react-apollo-hooks'
import useReactRouter from 'use-react-router'
import {defineMessages} from 'react-intl'
import {IconButton} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import idx from 'idx'

import {GET_ADDRESS_BY_ADDRESS58} from '@/api/queries'
import {useI18n} from '@/i18n/helpers'
import {useScrollFromBottom} from '@/components/hooks/useScrollFromBottom'

import WithModalState from '@/components/headless/modalState'
import PagedTransactions from './PagedTransactions'
import QRDialog from './QRDialog'
import {
  EntityIdCard,
  SimpleLayout,
  LoadingDots,
  LoadingError,
  SummaryCard,
  EntityCardContent,
  AdaValue,
  Tooltip,
  EntityHeading,
} from '@/components/visual'

import addressIcon from '@/assets/icons/qrcode.svg'
import {extractError} from '@/helpers/errors'

const summaryMessages = defineMessages({
  NA: 'N/A',
  address: 'Address ID',
  addressType: 'Address type',
  transactionsCount: 'Total transactions for address',
  balance: 'Address Balance',
  totalAdaReceived: 'Total received ADA',
  totalAdaSent: 'Total sent ADA',
})

const Row = ({label, value}) => {
  const {translate} = useI18n()
  return (
    <SummaryCard.Row>
      <SummaryCard.Label>{translate(label)}</SummaryCard.Label>
      <SummaryCard.Value>{value}</SummaryCard.Value>
    </SummaryCard.Row>
  )
}

const AddressSummaryCard = ({addressSummary, loading}) => {
  const {translate, formatInt} = useI18n()

  const labels = summaryMessages

  const NA = loading ? <LoadingDots /> : translate(labels.NA)
  addressSummary = loading ? null : addressSummary

  const data = {
    type: idx(addressSummary, (_) => _.type) || NA,
    txCount: formatInt(idx(addressSummary, (_) => _.transactionsCount), {defaultValue: NA}),
    balance: <AdaValue value={idx(addressSummary, (_) => _.balance)} noValue={NA} />,
    totalAdaReceived: (
      <AdaValue value={idx(addressSummary, (_) => _.totalAdaReceived)} noValue={NA} />
    ),
    totalAdaSent: <AdaValue value={idx(addressSummary, (_) => _.totalAdaSent)} noValue={NA} />,
  }

  return (
    <SummaryCard>
      <Row label={labels.addressType} value={data.type} />
      <Row label={labels.transactionsCount} value={data.txCount} />
      <Row label={labels.balance} value={data.balance} />
      <Row label={labels.totalAdaReceived} value={data.totalAdaReceived} />
      <Row label={labels.totalAdaSent} value={data.totalAdaSent} />
    </SummaryCard>
  )
}

const messages = defineMessages({
  title: 'Address',
  showQRCode: 'Show QR code',
  transactionsHeading:
    '{count} {count, plural, =0 {Transactions} one {Transaction} other {Transactions}}',
  qrCodeDialogEntityLabel: 'Address Id',
})

const useStyles = makeStyles((theme) => ({
  headingWrapper: {
    marginBottom: theme.spacing.unit * 6,
    marginTop: theme.spacing.unit * 6,
  },
  // 12px is width of hover part of button
  alignIconButton: {
    marginLeft: -12,
    marginRight: -12,
  },
}))

const useAddressSummary = (address58) => {
  const {loading, data, error} = useQuery(GET_ADDRESS_BY_ADDRESS58, {
    variables: {address58},
  })

  return {loading, error: extractError(error, ['address']), addressSummary: data.address}
}

const AddressScreen = () => {
  const {
    match: {
      params: {address58},
    },
  } = useReactRouter()
  const {loading, error, addressSummary} = useAddressSummary(address58)
  const {translate: tr} = useI18n()
  const classes = useStyles()
  const scrollToRef = useRef(null)

  useScrollFromBottom(scrollToRef, addressSummary)

  return (
    <div ref={scrollToRef}>
      <SimpleLayout title={tr(messages.title)}>
        <EntityIdCard
          label={tr(summaryMessages.address)}
          value={address58}
          iconRenderer={
            <WithModalState>
              {({isOpen, openModal, closeModal}) => (
                <React.Fragment>
                  <Tooltip title={tr(messages.showQRCode)}>
                    <IconButton
                      className={classes.alignIconButton}
                      onClick={openModal}
                      color="primary"
                    >
                      <img alt="show qr code" src={addressIcon} />
                    </IconButton>
                  </Tooltip>
                  <QRDialog
                    qrCodeValue={address58}
                    description={
                      <EntityCardContent
                        label={tr(messages.qrCodeDialogEntityLabel)}
                        value={address58}
                      />
                    }
                    isOpen={isOpen}
                    onClose={closeModal}
                  />
                </React.Fragment>
              )}
            </WithModalState>
          }
        />
        {error ? (
          <LoadingError error={error} />
        ) : (
          <React.Fragment>
            <AddressSummaryCard loading={loading} addressSummary={addressSummary} />
            <div className={classes.headingWrapper}>
              <EntityHeading>
                {tr(messages.transactionsHeading, {
                  count: idx(addressSummary, (_) => _.transactionsCount) || '',
                })}
              </EntityHeading>
            </div>
            <PagedTransactions
              loading={loading}
              targetAddress={address58}
              transactions={idx(addressSummary, (_) => _.transactions) || []}
            />
          </React.Fragment>
        )}
      </SimpleLayout>
    </div>
  )
}

export default AddressScreen
