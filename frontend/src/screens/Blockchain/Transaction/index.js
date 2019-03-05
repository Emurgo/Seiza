// @flow

import React from 'react'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {withProps} from 'recompose'
import {withRouter} from 'react-router'
import {Link} from 'react-router-dom'
import {defineMessages} from 'react-intl'
import idx from 'idx'
import gql from 'graphql-tag'

import {withStyles, createStyles, Typography, Grid, Divider} from '@material-ui/core'
import {
  SummaryCard,
  SimpleLayout,
  LoadingInProgress,
  DebugApolloError,
  EntityIdCard,
  ExpandableCard,
} from '@/components/visual'
import WithModalState from '@/components/headless/modalState'
import AssuranceChip from '@/components/common/AssuranceChip'
import AdaIcon from '@/assets/icons/transaction-id.svg'

import {ASSURANCE_LEVELS_VALUES} from '@/config'
import {withI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'

import type {Transaction} from '@/__generated__/schema.flow'

const messages = defineMessages({
  header: {
    id: 'transaction.header',
    defaultMessage: 'Transaction',
  },
  transactionId: {
    id: 'transaction.transactionId',
    defaultMessage: 'Transaction Id',
  },
  assuranceLevel: {
    id: 'transaction.assuranceLevel',
    defaultMessage: 'Assurance Level:',
  },
  confirmations: {
    id: 'transaction.confirmations',
    defaultMessage: '{count, plural, =0 {confirmations} one {confirmation} other {confirmations}}',
  },
  epoch: {
    id: 'transaction.epoch',
    defaultMessage: 'Epoch:',
  },
  slot: {
    id: 'transaction.slot',
    defaultMessage: 'Slot:',
  },
  date: {
    id: 'transaction.date',
    defaultMessage: 'Date:',
  },
  size: {
    id: 'transaction.size',
    defaultMessage: 'Size:',
  },
  fees: {
    id: 'transaction.fees',
    defaultMessage: 'Transaction Fees:',
  },
  notAvailable: {
    id: 'transaction.field.notAvailable',
    defaultMessage: 'N/A',
  },
  addressCount: {
    id: 'transaction.addressCount',
    defaultMessage: '{count, plural, =0 {# addresses} one {# address} other {# addresses}}',
  },
  from: {
    id: 'transaction.from',
    defaultMessage: 'From:',
  },
  to: {
    id: 'transaction.to',
    defaultMessage: 'To:',
  },
  seeAll: {
    id: 'transaction.seeAll',
    defaultMessage: 'See all addresses',
  },
  hideAll: {
    id: 'transaction.hideAll',
    defaultMessage: 'Hide all addresses',
  },
})

type AssuranceEnum = 'LOW' | 'MEDIUM' | 'HIGH'
const assuranceFromConfirmations = (cnt: number): AssuranceEnum => {
  if (cnt <= ASSURANCE_LEVELS_VALUES.LOW) {
    return 'LOW'
  } else if (cnt <= ASSURANCE_LEVELS_VALUES.MEDIUM) {
    return 'MEDIUM'
  } else {
    return 'HIGH'
  }
}

const Summary = withI18n(({i18n, caption, value}) => (
  <Grid container justify="space-between" alignItems="center">
    <Grid item>
      <Typography variant="caption">{caption}</Typography>
    </Grid>
    <Grid item>
      <Typography variant="body1">{value}</Typography>
    </Grid>
  </Grid>
))

const addressSummaryStyles = (theme) =>
  createStyles({
    wrapper: {
      paddingLeft: theme.spacing.unit * 3,
      paddingRight: theme.spacing.unit * 3,
    },
  })

const AddressesSummary = compose(
  withI18n,
  withStyles(addressSummaryStyles)
)(({transaction, i18n, classes}) => {
  const {translate, formatAda} = i18n
  return (
    <Grid container className={classes.wrapper}>
      <Grid item xs={6}>
        <Summary
          caption={
            <React.Fragment>
              {translate(messages.from)}{' '}
              {translate(messages.addressCount, {count: transaction.inputs.length})}
            </React.Fragment>
          }
          value={<React.Fragment>- {formatAda(transaction.totalInput)} ADA</React.Fragment>}
        />
      </Grid>
      <Grid item xs={6}>
        <Summary
          caption={
            <React.Fragment>
              {translate(messages.to)}{' '}
              {translate(messages.addressCount, {count: transaction.outputs.length})}
            </React.Fragment>
          }
          value={<React.Fragment>+ {formatAda(transaction.totalOutput)} ADA</React.Fragment>}
        />
      </Grid>
    </Grid>
  )
})

const breakdownStyles = (theme) =>
  createStyles({
    truncate: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
  })

const Breakdown = compose(
  withI18n,
  withStyles(breakdownStyles)
)((props) => {
  const {i18n, valuePrefix, captionPrefix, classes, target} = props
  const {formatAda} = i18n
  const {address58, amount} = target

  return (
    <React.Fragment>
      <Grid container justify="space-between" alignItems="center">
        <Grid item xs={6}>
          <Typography variant="caption" className={classes.truncate}>
            {captionPrefix} <Link to={routeTo.address(address58)}>{address58}</Link>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Grid container justify="flex-end">
            {valuePrefix} {formatAda(amount)} ADA
          </Grid>
        </Grid>
      </Grid>
      <Divider />
    </React.Fragment>
  )
})

const AddressesBreakdown = withI18n(({transaction, i18n}) => {
  const {formatInt} = i18n
  return (
    <Grid container>
      <Grid item xs={6}>
        {transaction.inputs.map((input, index) => (
          <Breakdown
            key={input.address58}
            target={input}
            captionPrefix={`# ${formatInt(index + 1)}`}
            valuePrefix={'-'}
          />
        ))}
      </Grid>
      <Grid item xs={6}>
        {transaction.outputs.map((output, index) => (
          <Breakdown
            key={output.address58}
            target={output}
            captionPrefix={`# ${formatInt(index + 1)}`}
            valuePrefix={'+'}
          />
        ))}
      </Grid>
    </Grid>
  )
})

const _TransactionSummary = ({transaction, i18n}: {transaction: Transaction, i18n: any}) => {
  const {translate, formatAda, formatInt, formatTimestamp} = i18n

  const N_A = translate(messages.notAvailable)

  const Item = ({label, children}) => (
    <SummaryCard.Row>
      <SummaryCard.Label>{translate(label)}</SummaryCard.Label>
      <SummaryCard.Value>{children}</SummaryCard.Value>
    </SummaryCard.Row>
  )

  return (
    <SummaryCard>
      <Item label={messages.assuranceLevel}>
        <div>
          {transaction.confirmationsCount != null && (
            <AssuranceChip level={assuranceFromConfirmations(transaction.confirmationsCount)} />
          )}{' '}
          <span>
            {formatInt(transaction.confirmationsCount)}{' '}
            {translate(messages.confirmations, {
              count: transaction.confirmationsCount,
            })}
          </span>
        </div>
      </Item>
      <Item label={messages.epoch}>
        {formatInt(idx(transaction, (_) => _.block.epoch), {defaultValue: N_A})}
      </Item>

      <Item label={messages.slot}>
        {formatInt(idx(transaction, (_) => _.block.slot), {defaultValue: N_A})}
      </Item>
      <Item label={messages.date}>
        {formatTimestamp(idx(transaction, (_) => _.block.timeIssued), {
          defaultValue: N_A,
          format: formatTimestamp.FMT_MONTH_NUMERAL,
        })}
      </Item>
      <Item label={messages.size}>{formatInt(transaction.size, {defaultValue: N_A})}</Item>
      <Item label={messages.fees}>{`${formatAda(transaction.fees)} ADA`}</Item>
    </SummaryCard>
  )
}

const TransactionSummary = compose(withI18n)(_TransactionSummary)

const TransactionScreen = ({i18n, transactionDataProvider}) => {
  const {translate} = i18n
  const {loading, transaction, error} = transactionDataProvider
  return (
    <SimpleLayout title={translate(messages.header)}>
      {loading ? (
        <LoadingInProgress />
      ) : error ? (
        <DebugApolloError error={error} />
      ) : (
        <React.Fragment>
          <EntityIdCard
            label={translate(messages.transactionId)}
            value={transaction.txHash}
            iconRenderer={<img alt="" src={AdaIcon} width={40} height={40} />}
          />
          <TransactionSummary transaction={transaction} />
          <WithModalState>
            {({isOpen, toggle}) => (
              <ExpandableCard
                expanded={isOpen}
                onChange={toggle}
                renderHeader={() => <AddressesSummary transaction={transaction} />}
                renderExpandedArea={() => <AddressesBreakdown transaction={transaction} />}
                footer={isOpen ? translate(messages.hideAll) : translate(messages.seeAll)}
              />
            )}
          </WithModalState>
        </React.Fragment>
      )}
    </SimpleLayout>
  )
}

export default compose(
  withRouter,
  withProps((props) => ({
    txHash: props.match.params.txHash,
  })),
  withI18n,
  graphql(
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
          size
        }
      }
    `,
    {
      name: 'transactionDataProvider',
      options: ({txHash}) => ({
        variables: {txHash},
      }),
    }
  )
)(TransactionScreen)
