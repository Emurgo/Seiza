// @flow

import React from 'react'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {withProps} from 'recompose'
import {withRouter} from 'react-router'

import {defineMessages} from 'react-intl'
import {Grid, Card, Typography} from '@material-ui/core'
import SimpleLayout from '@/components/visual/SimpleLayout'
import {Link} from 'react-router-dom'

import {routeTo} from '@/helpers/routes'

import {withI18n} from '@/i18n/helpers'
import {GET_BLOCK_BY_HASH} from '@/api/queries'

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

const blockSummaryLabels = defineMessages({
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

const TransactionCard = ({transaction}) => (
  <Card>
    <Link to={routeTo.transaction(transaction.txHash)}>{transaction.txHash}</Link>
  </Card>
)

const TransactionList = ({transactions}) => (
  <React.Fragment>
    {transactions && transactions.map((tx) => <TransactionCard key={tx.txHash} transaction={tx} />)}
  </React.Fragment>
)

const _BlockSummaryCard = ({i18n, block}) => {
  const {translate, formatInt, formatTimestamp} = i18n

  return (
    <Card>
      <Item label={translate(blockSummaryLabels.blockHash)}>
        <Value value={block.blockHash} />
      </Item>
      <Item label={translate(blockSummaryLabels.epoch)}>
        <Value value={formatInt(block.epoch)} />
      </Item>
      <Item label={translate(blockSummaryLabels.slot)}>
        <Value value={formatInt(block.slot)} />
      </Item>
      <Item label={translate(blockSummaryLabels.issuedAt)}>
        <Value value={formatTimestamp(block.timeIssued)} />
      </Item>
      <Item label={translate(blockSummaryLabels.transactionsCount)}>
        <Value value={formatInt(block.transactionsCount)} />
      </Item>
    </Card>
  )
}

const BlockSummaryCard = compose(withI18n)(_BlockSummaryCard)

const Loading = () => <div>Loading...</div>

const blockMessages = defineMessages({
  title: {
    id: 'blockchain.block.title',
    defaultMessage: '<Block>',
  },
})

const Block = ({blockResult, i18n}) => {
  const {loading, block, error} = blockResult
  const {translate} = i18n

  return (
    <SimpleLayout title={translate(blockMessages.title)}>
      <Heading>General</Heading>
      {error ? (
        <ErrorComponent error={error} />
      ) : loading ? (
        <Loading />
      ) : (
        <React.Fragment>
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
  })),
  withBlockByHash,
  withI18n
)(Block)
