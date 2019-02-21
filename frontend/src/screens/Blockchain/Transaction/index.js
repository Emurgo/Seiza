// @flow
import React from 'react'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {withProps} from 'recompose'
import {withRouter} from 'react-router'
import {Link} from 'react-router-dom'
import {defineMessages} from 'react-intl'
import {withStyles, createStyles, Card, Typography, Grid, Chip, Divider} from '@material-ui/core'

import classNames from 'classnames'

import SimpleLayout from '@/components/visual/SimpleLayout'

import AdaIcon from '@/tmp_assets/ada-icon.png'
import CopyIcon from '@/tmp_assets/copy-icon.png'

import {ASSURANCE_LEVELS_VALUES} from '@/config'
import {GET_TRANSACTION_BY_HASH} from '@/api/queries'
import {withI18n, monthNumeralFormat} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'
import ExpandableCard from '@/components/visual/ExpandableCard'
import WithModalState from '@/components/headless/modalState'

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

// TODO: flow
// TODO: very temporary styles

const styles = (theme) =>
  createStyles({
    title: {
      fontSize: theme.typography.fontSize * 3,
    },
    card: {
      margin: theme.spacing.unit * 2,
      padding: theme.spacing.unit * 2,
    },
    cardContent: {
      flex: 1,
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
    },
    listRow: {
      'paddingTop': theme.spacing.unit * 2.5,
      'paddingBottom': theme.spacing.unit * 2.5,

      '&:not(:last-child)': {
        borderBottom: '0.5px solid gray',
      },
      '&:last-child': {
        paddingBottom: 0,
      },
      '&:first-child': {
        paddingTop: 0,
      },
    },
    flex: {
      display: 'flex',
    },
    chip: {
      maxHeight: theme.spacing.unit * 2,
      fontSize: theme.typography.fontSize * 0.8,
      textTransform: 'uppercase',
      background: '#8AE8D4',
      color: 'white',
      marginRight: theme.spacing.unit * 1.5,
    },
    centeredFlex: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  })

const withTransactionByHash = graphql(GET_TRANSACTION_BY_HASH, {
  name: 'transaction',
  options: ({txHash}) => ({
    variables: {txHash},
  }),
})

// TODO: extract to own reusable component in next PR
const List = withStyles(styles)(({children, classes}) => {
  return (
    <Grid container direction="column">
      {children}
    </Grid>
  )
})

const ListItem = withStyles(styles)(({label, children, classes}) => {
  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      className={classes.listRow}
    >
      <Grid item>
        <Typography variant="caption">{label}</Typography>
      </Grid>
      <Grid item>{children}</Grid>
    </Grid>
  )
})

const assuranceLevelStyles = (theme) =>
  createStyles({
    LOW: {
      color: 'white',
      backgroundColor: '#FF3860',
    },
    MEDIUM: {
      color: 'black',
      backgroundColor: '#FFDD57',
    },
    HIGH: {
      color: 'white',
      backgroundColor: '#87E6D4',
    },
    uppercase: {
      textTransform: 'uppercase',
    },
  })

type AssuranceLevel = 'LOW' | 'MEDIUM' | 'HIGH'
const assuranceFromConfirmations = (cnt: number): AssuranceLevel => {
  if (cnt <= ASSURANCE_LEVELS_VALUES.LOW) {
    return 'LOW'
  } else if (cnt <= ASSURANCE_LEVELS_VALUES.MEDIUM) {
    return 'MEDIUM'
  } else {
    return 'HIGH'
  }
}
const assuranceMessages = defineMessages({
  LOW: {
    id: 'transaction.lowAssurance',
    defaultMessage: 'Low',
  },
  MEDIUM: {
    id: 'transaction.lowAssurance',
    defaultMessage: 'Medium',
  },
  HIGH: {
    id: 'transaction.lowAssurance',
    defaultMessage: 'High',
  },
})
const Assurance = compose(
  withStyles(assuranceLevelStyles),
  withI18n
)(({classes, txConfirmationsCount, i18n}) => {
  const assurance = assuranceFromConfirmations(txConfirmationsCount)
  const text = i18n.translate(assuranceMessages[assurance])
  const className = classes[assurance]
  return <Chip label={text} className={classNames(className, classes.uppercase)} />
})

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

const AddressesSummary = withI18n(({transaction, i18n}) => {
  const {translate, formatAda} = i18n
  return (
    <Grid container>
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

const Transaction = (props) => {
  const {classes} = props
  const {loading, transaction} = props.transaction
  const {translate, formatAda, formatInt, formatTimestamp} = props.i18n
  // TODO: 'loading' check inside 'compose' once we have loading component
  if (loading) {
    return null
  }

  return (
    <SimpleLayout title={translate(messages.header)}>
      <Card className={classNames(classes.card, classes.flex)}>
        <Grid item className={classNames(classes.flex, classes.centeredFlex)}>
          <img src={AdaIcon} width={40} height={40} />
        </Grid>

        <div className={classes.cardContent}>
          <Typography variant="caption">{translate(messages.transactionId)}</Typography>
          <Grid container direction="row" justify="space-between" alignItems="center">
            <span>{transaction.txHash}</span>
            <span>
              <img src={CopyIcon} width={30} height={30} />
            </span>
          </Grid>
        </div>
      </Card>

      <Card className={classes.card}>
        <List>
          <ListItem label={translate(messages.assuranceLevel)}>
            <div>
              {/* TODO finish possible labels high/medium/low */}
              <Assurance txConfirmationsCount={transaction.confirmationsCount} />{' '}
              <span>
                {formatInt(transaction.confirmationsCount)}{' '}
                {translate(messages.confirmations, {
                  count: transaction.confirmationsCount,
                })}
              </span>
            </div>
          </ListItem>
          <ListItem label={translate(messages.epoch)}>{formatInt(transaction.blockEpoch)}</ListItem>
          <ListItem label={translate(messages.slot)}>{formatInt(transaction.blockSlot)}</ListItem>
          <ListItem label={translate(messages.date)}>
            {formatTimestamp(transaction.txTimeIssued, {format: monthNumeralFormat})}
          </ListItem>
          <ListItem label={translate(messages.size)}>
            {formatInt(transaction.size, {defaultValue: 'TODO'})}
          </ListItem>
          <ListItem label={translate(messages.fees)}>
            {`${formatAda(transaction.fees)} ADA`}
          </ListItem>
        </List>
      </Card>
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
    </SimpleLayout>
  )
}

export default compose(
  withRouter,
  withProps((props) => ({
    txHash: props.match.params.txHash,
  })),
  withTransactionByHash,
  withI18n,
  withStyles(styles)
)(Transaction)
