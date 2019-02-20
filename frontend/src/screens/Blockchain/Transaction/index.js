// @flow

import React from 'react'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {withProps} from 'recompose'
import {withRouter} from 'react-router'
import {defineMessages} from 'react-intl'
import {withStyles, createStyles, Card, Typography, Grid, Chip} from '@material-ui/core'
import classNames from 'classnames'

import AdaIcon from '../../../tmp_assets/ada-icon.png'
import CopyIcon from '../../../tmp_assets/copy-icon.png'

import {GET_TRANSACTION_BY_HASH} from '../../../api/queries'
import {monthNumeralFormat, withI18n} from '../../../i18n/helpers'
import {ASSURANCE_LEVELS_VALUES} from '../../../config'

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
})

// TODO: flow
// TODO: very temporary styles

const styles = (theme) =>
  createStyles({
    title: {
      fontSize: theme.typography.fontSize * 3,
    },
    wrapper: {
      width: '100%',
      paddingLeft: '10%',
      paddingRight: '10%',
      background: '#F4F6FC',
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

const Transaction = (props) => {
  const {classes} = props
  const {loading, transaction} = props.transaction
  const {translate, formatAda, formatInt, formatTimestamp} = props.i18n
  // TODO: 'loading' check inside 'compose' once we have loading component
  if (loading) {
    return null
  }

  return (
    <div className={classes.wrapper}>
      <Typography variant="h1">{translate(messages.header)}</Typography>

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
    </div>
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
