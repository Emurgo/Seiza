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

import SimpleLayout from '@/components/visual/SimpleLayout'

import addressIcon from '@/tmp_assets/tmp-icon-address.png'
import copyIcon from '@/tmp_assets/tmp-icon-copy.png'

const I18N_PREFIX = 'blockchain.address'

const generalSection = defineMessages({
  heading: {
    id: `${I18N_PREFIX}.heading`,
    defaultMessage: 'General',
  },
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

const withAddressByAddress58: any = graphql(GET_ADDRESS_BY_ADDRESS58, {
  name: 'address',
  options: ({address58}: any) => ({
    variables: {address58},
  }),
})

const Item = ({label, children}) => (
  <Grid container direction="row" justify="space-between" alignItems="center">
    <Grid item>
      <Typography variant="caption">{label}</Typography>
    </Grid>
    <Grid item>{children}</Grid>
  </Grid>
)
const Value = ({value}) => <Typography>{value}</Typography>
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
              <img src={addressIcon} />
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
                  <img src={copyIcon} />
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

const Address = (props) => {
  const {loading, address} = props.address
  const {
    i18n: {translate, formatInt, formatAda},
  } = props
  // TODO: 'loading' check inside 'compose' once we have loading component
  if (loading) {
    return null
  }

  return (
    <SimpleLayout title={translate(generalSection.heading)}>
      <AddressValueCard label={translate(generalSection.address)} value={address.address58} />
      <Card>
        <Grid container direction="column">
          <Item label={translate(generalSection.addressType)}>
            <Value value={address.type} />
          </Item>
          <Item label={translate(generalSection.transactionsCount)}>
            <Value value={formatInt(address.transactionsCount)} />
          </Item>
          <Item label={translate(generalSection.balance)}>
            <Value value={formatAda(address.balance)} />
          </Item>
          <Item label={translate(generalSection.totalAdaReceived)}>
            <Value value={formatAda(address.totalAdaReceived)} />
          </Item>
          <Item label={translate(generalSection.totalAdaSent)}>
            <Value value={formatAda(address.totalAdaSent)} />
          </Item>
        </Grid>
      </Card>
      <Heading>_Transactions_</Heading>
      <PagedTransactions transactions={address.transactions} />
    </SimpleLayout>
  )
}

export default compose(
  withRouter,
  withProps((props) => ({
    address58: props.match.params.address58,
  })),
  withAddressByAddress58,
  withI18n
)(Address)
