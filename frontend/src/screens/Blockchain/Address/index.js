// @flow
import React from 'react'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {withProps} from 'recompose'
import {withRouter} from 'react-router'
import {defineMessages} from 'react-intl'
import {Tooltip, IconButton, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {GET_ADDRESS_BY_ADDRESS58} from '@/api/queries'
import {withI18n, useI18n} from '@/i18n/helpers'

import WithModalState from '@/components/headless/modalState'
import PagedTransactions from './PagedTransactions'
import QRDialog from './QRDialog'
import {
  EntityIdCard,
  SimpleLayout,
  LoadingInProgress,
  DebugApolloError,
  SummaryCard,
  EntityCardContent,
} from '@/components/visual'

import addressIcon from '@/assets/icons/qrcode.svg'

const summaryMessages = defineMessages({
  address: 'Address ID',
  addressType: 'Address type',
  transactionsCount: 'Total transactions for address',
  balance: 'Address Balance',
  totalAdaReceived: 'Total received ADA',
  totalAdaSent: 'Total sent ADA',
})

const _AddressSummaryCard = ({addressSummary, i18n}) => {
  const {translate, formatInt, formatAda} = i18n

  const label = summaryMessages

  const Item = ({label, children}) => (
    <SummaryCard.Row>
      <SummaryCard.Label>{translate(label)}</SummaryCard.Label>
      <SummaryCard.Value>{children}</SummaryCard.Value>
    </SummaryCard.Row>
  )

  return (
    <SummaryCard>
      <Item label={label.addressType}>{addressSummary.type}</Item>
      <Item label={label.transactionsCount}>{formatInt(addressSummary.transactionsCount)}</Item>
      <Item label={label.balance}>{formatAda(addressSummary.balance)}</Item>
      <Item label={label.totalAdaReceived}>{formatAda(addressSummary.totalAdaReceived)}</Item>
      <Item label={label.totalAdaSent}>{formatAda(addressSummary.totalAdaSent)}</Item>
    </SummaryCard>
  )
}

const AddressSummaryCard = withI18n(_AddressSummaryCard)

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

const AddressScreen = ({addressDataProvider, i18n}) => {
  const {loading, address, error} = addressDataProvider
  const {translate: tr} = i18n
  return (
    <SimpleLayout title={tr(messages.title)}>
      {loading ? (
        <LoadingInProgress />
      ) : error ? (
        <DebugApolloError error={error} />
      ) : (
        <React.Fragment>
          <EntityIdCard
            label={tr(summaryMessages.address)}
            value={address.address58}
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
                      qrCodeValue={address.address58}
                      description={
                        <EntityCardContent
                          label={tr(messages.qrCodeDialogEntityLabel)}
                          value={address.address58}
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
          <AddressSummaryCard addressSummary={address} />
          <Heading txCount={address.transactions && address.transactions.length} />
          <PagedTransactions transactions={address.transactions} />
        </React.Fragment>
      )}
    </SimpleLayout>
  )
}

export default compose(
  withRouter,
  withProps((props) => ({
    address58: props.match.params.address58,
  })),
  graphql(GET_ADDRESS_BY_ADDRESS58, {
    name: 'addressDataProvider',
    options: ({address58}: any) => ({
      variables: {address58},
    }),
  }),
  withI18n
)(AddressScreen)
