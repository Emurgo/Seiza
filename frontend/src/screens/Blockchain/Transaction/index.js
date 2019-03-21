// @flow
import React from 'react'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {withProps} from 'recompose'
import {withRouter} from 'react-router'
import {defineMessages} from 'react-intl'
import classnames from 'classnames'
import idx from 'idx'
import gql from 'graphql-tag'
import {makeStyles} from '@material-ui/styles'
import {Typography, Grid} from '@material-ui/core'

import {
  SummaryCard,
  SimpleLayout,
  LoadingInProgress,
  DebugApolloError,
  EntityIdCard,
  ExpandableCard,
  AdaValue,
  Link,
  Divider,
} from '@/components/visual'
import WithModalState from '@/components/headless/modalState'
import AssuranceChip from '@/components/common/AssuranceChip'
import AdaIcon from '@/assets/icons/transaction-id.svg'

import {ASSURANCE_LEVELS_VALUES} from '@/config'
import {useI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'

const messages = defineMessages({
  header: 'Transaction',
  transactionId: 'Transaction Id',
  assuranceLevel: 'Assurance Level:',
  confirmations: '{count, plural, =0 {confirmations} one {confirmation} other {confirmations}}',
  epoch: 'Epoch:',
  slot: 'Slot:',
  date: 'Date:',
  size: 'Size:',
  fees: 'Transaction Fees:',
  notAvailable: 'N/A',
  addressCount: '#{count, plural, =0 {# addresses} one {# address} other {# addresses}}',
  from: 'From:',
  to: 'To:',
  seeAll: 'See all addresses',
  hideAll: 'Hide all addresses',
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

const Summary = ({caption, value}) => {
  return (
    <Grid container justify="space-between" alignItems="center" direction="row">
      <Grid item>
        <Typography variant="caption">{caption}</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">{value}</Typography>
      </Grid>
    </Grid>
  )
}

const useCommonStyles = makeStyles((theme) => ({
  leftSide: {
    borderRight: `1px solid ${theme.palette.contentUnfocus}`,
  },
}))

const useAddressSummaryStyles = makeStyles((theme) => ({
  text: {
    textTransform: 'uppercase',
  },
  padding: {
    padding: theme.spacing.unit * 4,
  },
}))

const AddressesSummary = ({transaction}) => {
  const {translate} = useI18n()
  const commonClasses = useCommonStyles()
  const classes = useAddressSummaryStyles()
  return (
    <Grid container direction="row">
      <Grid item xs={6} className={classnames(commonClasses.leftSide, classes.padding)}>
        <Summary
          caption={
            <React.Fragment>
              <Typography variant="caption" inline color="textSecondary" className={classes.text}>
                {translate(messages.from)}
              </Typography>{' '}
              <Typography variant="caption" inline color="textPrimary">
                {translate(messages.addressCount, {count: transaction.inputs.length})}
              </Typography>
            </React.Fragment>
          }
          value={<AdaValue value={transaction.totalInput} showCurrency showSign="-" />}
        />
      </Grid>
      <Grid item xs={6} className={classes.padding}>
        <Summary
          caption={
            <React.Fragment>
              <Typography variant="caption" inline color="textSecondary" className={classes.text}>
                {translate(messages.to)}
              </Typography>{' '}
              <Typography variant="caption" inline color="textPrimary">
                {translate(messages.addressCount, {count: transaction.outputs.length})}
              </Typography>
            </React.Fragment>
          }
          value={<AdaValue value={transaction.totalOutput} showCurrency showSign="+" />}
        />
      </Grid>
    </Grid>
  )
}

const useBreakdownStyles = makeStyles((theme) => ({
  margin: {
    marginLeft: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 4,
  },
  rowSpacing: {
    marginTop: theme.spacing.unit * 1.5,
    marginBottom: theme.spacing.unit * 1.5,
  },
}))

const BreakdownItem = (props) => {
  const {valuePrefix, captionPrefix, target} = props
  const {address58, amount} = target
  const breakdownClasses = useBreakdownStyles()
  return (
    <div className={breakdownClasses.margin}>
      <Divider light />
      <Grid
        container
        justify="space-between"
        alignItems="center"
        direction="row"
        className={breakdownClasses.rowSpacing}
      >
        <Grid item xs={6}>
          <Typography variant="caption" color="textSecondary" noWrap>
            {captionPrefix} <Link to={routeTo.address(address58)}>{address58}</Link>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Grid container justify="flex-end" direction="row">
            <AdaValue value={amount} showSign={valuePrefix} showCurrency />
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

const AddressesBreakdown = ({transaction}) => {
  const {formatInt} = useI18n()
  const commonClasses = useCommonStyles()
  return (
    <Grid container direction="row">
      <Grid item xs={6} className={commonClasses.leftSide}>
        {transaction.inputs.map((input, index, items) => (
          <BreakdownItem
            key={index}
            target={input}
            captionPrefix={`# ${formatInt(index + 1)}`}
            valuePrefix={'-'}
          />
        ))}
      </Grid>
      <Grid item xs={6}>
        {transaction.outputs.map((output, index, items) => (
          <BreakdownItem
            key={index}
            target={output}
            captionPrefix={`# ${formatInt(index + 1)}`}
            valuePrefix={'+'}
          />
        ))}
      </Grid>
    </Grid>
  )
}

const TransactionSummary = ({transaction}) => {
  const {translate, formatInt, formatTimestamp} = useI18n()

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
        <span>
          {transaction.confirmationsCount != null && (
            <AssuranceChip level={assuranceFromConfirmations(transaction.confirmationsCount)} />
          )}{' '}
          <span>
            {formatInt(transaction.confirmationsCount)}{' '}
            {translate(messages.confirmations, {
              count: transaction.confirmationsCount,
            })}
          </span>
        </span>
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
      <Item label={messages.fees}>
        <AdaValue value={transaction.fees} showCurrency />
      </Item>
    </SummaryCard>
  )
}

const TransactionScreen = ({transactionDataProvider}) => {
  const {translate} = useI18n()
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
