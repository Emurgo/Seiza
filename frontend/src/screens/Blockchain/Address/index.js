// @flow

import React from 'react'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {withProps} from 'recompose'
import {withRouter} from 'react-router'
import QRCode from 'qrcode.react'
import {defineMessages} from 'react-intl'
import {Button, Grid, Modal, Card, Typography} from '@material-ui/core'

import {GET_ADDRESS_BY_ADDRESS58} from '@/api/queries'
import {withI18n} from '@/i18n/helpers'

import WithModalState from '@/components/headless/modalState'
import WithCopyToClipboard from '@/components/headless/copyToClipboard'
import PagedTransactions from './PagedTransactions'

import {SimpleLayout, LoadingInProgress, DebugApolloError, SummaryCard} from '@/components/visual'

import addressIcon from '@/tmp_assets/tmp-icon-address.png'
import copyIcon from '@/tmp_assets/tmp-icon-copy.png'

const I18N_PREFIX = 'blockchain.address'

const summaryMessages = defineMessages({
  address: {
    id: `${I18N_PREFIX}.address`,
    defaultMessage: 'Address ID',
  },
  addressType: {
    id: `${I18N_PREFIX}.addressType`,
    defaultMessage: 'Address type',
  },
  transactionsCount: {
    id: `${I18N_PREFIX}.transactionsCount`,
    defaultMessage: 'Total transactions for address',
  },
  balance: {
    id: `${I18N_PREFIX}.balance`,
    defaultMessage: 'Address Balance',
  },
  totalAdaReceived: {
    id: `${I18N_PREFIX}.totalAdaReceived`,
    defaultMessage: 'Total received ADA',
  },
  totalAdaSent: {
    id: `${I18N_PREFIX}.totalAdaSent`,
    defaultMessage: 'Total sent ADA',
  },
})

const Heading = ({children}) => <Typography variant="h4">{children}</Typography>

type QRModalProps = {isOpen: boolean, onClose: () => any, value: string}

const QRModal = ({isOpen, onClose, value}: QRModalProps) => (
  <Modal open={isOpen} onClose={onClose}>
    <QRCode value={value} size={128} />
  </Modal>
)

const AddressValueCard = ({label, value}) => (
  <WithModalState>
    {({isOpen, openModal, closeModal}) => (
      <Card>
        <Grid container direction="row" justify="space-between">
          <Grid item>
            <Button onClick={openModal}>
              <img alt="show qr code" src={addressIcon} />
            </Button>
          </Grid>
          <Grid item xs container direction="column">
            <Typography variant="caption">{label}</Typography>
            <Typography>{value}</Typography>
          </Grid>
          <WithCopyToClipboard value={value}>
            {({copy, isCopied}) => (
              <React.Fragment>
                <Button onClick={copy}>
                  <img alt="copy to clipboard" src={copyIcon} />
                </Button>
                {isCopied && 'copied'}
              </React.Fragment>
            )}
          </WithCopyToClipboard>
        </Grid>
        <QRModal value={value} isOpen={isOpen} onClose={closeModal} />
      </Card>
    )}
  </WithModalState>
)

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
      <Item label={label.transactionsCount}>{formatInt(addressSummary.transactionsCount)}></Item>
      <Item label={label.balance}>{formatAda(addressSummary.balance)}</Item>
      <Item label={label.totalAdaReceived}>{formatAda(addressSummary.totalAdaReceived)}</Item>
      <Item label={label.totalAdaSent}>{formatAda(addressSummary.totalAdaSent)}</Item>
    </SummaryCard>
  )
}

const AddressSummaryCard = withI18n(_AddressSummaryCard)

const messages = defineMessages({
  title: {
    id: `${I18N_PREFIX}.title`,
    defaultMessage: 'Address',
  },
  transactionsHeading: {
    id: `${I18N_PREFIX}.transactionsHeading`,
    defaultMessage: 'Transactions',
  },
})

const AddressScreen = ({addressDataProvider, i18n}) => {
  const {loading, address, error} = addressDataProvider
  const {translate} = i18n
  return (
    <SimpleLayout title={translate(summaryMessages.title)}>
      {loading ? (
        <LoadingInProgress />
      ) : error ? (
        <DebugApolloError error={error} />
      ) : (
        <React.Fragment>
          <AddressValueCard label={translate(summaryMessages.address)} value={address.address58} />
          <AddressSummaryCard addressSummary={address} />
          <Heading>{translate(messages.transactionsHeading)}</Heading>
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
