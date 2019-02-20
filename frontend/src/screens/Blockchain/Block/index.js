// @flow

import React from 'react'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {withProps} from 'recompose'
import {withRouter} from 'react-router'
import {defineMessages} from 'react-intl'

import {Grid, Card, Typography} from '@material-ui/core'

import {withI18n} from '../../../i18n/helpers'
import {GET_BLOCK_BY_HASH} from '../../../api/queries'

const withBlockByHash = graphql(GET_BLOCK_BY_HASH, {
  name: 'blockResult',
  options: ({blockHash}) => {
    return {
      variables: {blockHash},
    }
  },
})

const ErrorComponent = (error) => `Error${JSON.stringify(error)}`

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

const I18N_PREFIX = 'block.fields'

const fieldLabels = defineMessages({
  blockHash: {
    id: `${I18N_PREFIX}.blockHash`,
    defaultMessage: 'Block hash',
  },
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

const TransactionCard = ({transaction}) => <Card>{transaction.txHash}</Card>

const TransactionList = ({transactions}) => (
  <React.Fragment>
    {transactions && transactions.map((tx) => <TransactionCard key={tx.txHash} transaction={tx} />)}
  </React.Fragment>
)

const Block = (props) => {
  const {loading, block, error} = props.blockResult
  const {translate, formatInt, formatTimestamp} = props.i18n
  if (loading) {
    return null
  }
  if (error) return <ErrorComponent error={error} />

  return (
    <div>
      <Heading>General</Heading>
      <Card>
        <Item label={translate(fieldLabels.blockHash)}>
          <Value value={block.blockHash} />
        </Item>
        <Item label={translate(fieldLabels.epoch)}>
          <Value value={formatInt(block.epoch)} />
        </Item>
        <Item label={translate(fieldLabels.slot)}>
          <Value value={formatInt(block.slot)} />
        </Item>
        <Item label={translate(fieldLabels.issuedAt)}>
          <Value value={formatTimestamp(block.timeIssued)} />
        </Item>
        <Item label={translate(fieldLabels.transactionsCount)}>
          <Value value={formatInt(block.transactionsCount)} />
        </Item>
      </Card>
      <TransactionList transactions={block.transactions} />
    </div>
  )
}

export default compose(
  withRouter,
  withProps((props) => ({
    blockHash: props.match.params.blockHash,
  })),
  withBlockByHash,
  withI18n
)(Block)
