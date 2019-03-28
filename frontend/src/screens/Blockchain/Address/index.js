// @flow
import React from 'react'
import {useQuery} from 'react-apollo-hooks'
import useReactRouter from 'use-react-router'
import {defineMessages} from 'react-intl'
import {Tooltip, IconButton, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import idx from 'idx'

import {GET_ADDRESS_BY_ADDRESS58} from '@/api/queries'
import {useI18n} from '@/i18n/helpers'

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
} from '@/components/visual'

import addressIcon from '@/assets/icons/qrcode.svg'

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
  transactionsHeading: 'Transactions',
  qrCodeDialogEntityLabel: 'Address Id',
})

const useHeadingStyles = makeStyles((theme) => ({
  underline: {
    borderBottom: `1px solid ${theme.palette.text.secondary}`,
  },
  wrapper: {
    marginBottom: theme.spacing.unit * 6,
    marginTop: theme.spacing.unit * 6,
  },
}))

const Heading = ({txCount}) => {
  const {translate: tr} = useI18n()
  const classes = useHeadingStyles()
  return (
    <div className={classes.wrapper}>
      <Typography variant="h2" color="textSecondary">
        <span className={classes.underline}>{txCount}</span> {tr(messages.transactionsHeading)}
      </Typography>
    </div>
  )
}

const useAddressSummary = (address58) => {
  const {loading, data, error} = useQuery(GET_ADDRESS_BY_ADDRESS58, {
    variables: {address58},
  })

  return {loading, error, addressSummary: data.address}
}

const AddressScreen = () => {
  const {
    match: {
      params: {address58},
    },
  } = useReactRouter()
  const {loading, error, addressSummary} = useAddressSummary(address58)
  const {translate: tr} = useI18n()
  return (
    <SimpleLayout title={tr(messages.title)}>
      <EntityIdCard
        label={tr(summaryMessages.address)}
        value={address58}
        iconRenderer={
          <WithModalState>
            {({isOpen, openModal, closeModal}) => (
              <React.Fragment>
                <Tooltip title={tr(messages.showQRCode)}>
                  <IconButton onClick={openModal}>
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
          <Heading txCount={idx(addressSummary, (_) => _.transactionsCount)} />
          <PagedTransactions
            loading={loading}
            transactions={idx(addressSummary, (_) => _.transactions) || []}
          />
        </React.Fragment>
      )}
    </SimpleLayout>
  )
}

export default AddressScreen
