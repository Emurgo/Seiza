// @flow

import React from 'react'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {withProps} from 'recompose'
import {withRouter} from 'react-router'
import moment from 'moment'
import {injectIntl, defineMessages} from 'react-intl'
import Card from '@material-ui/core/Card'
import Chip from '@material-ui/core/Chip'
import {withStyles, createStyles} from '@material-ui/core'

import AdaIcon from '../../components/visual/tmp_assets/ada-icon.png'
import CopyIcon from '../../components/visual/tmp_assets/copy-icon.png'

import {GET_TRANSACTION_BY_HASH, GET_CURRENT_BLOCK_COUNT} from '../../api/queries'
import {getIntlFormatters} from '../../i18n/helpers'

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
    defaultMessage: 'confirmation',
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
    generalField: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    movementField: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    card: {
      display: 'flex',
      margin: theme.spacing.unit * 2,
      padding: theme.spacing.unit * 2,
    },
    cardContent: {
      flex: 1,
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
    },
    cardRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
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
    rowItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    listWrapper: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
    },
    adaIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    chip: {
      maxHeight: theme.spacing.unit * 2,
      fontSize: theme.typography.fontSize * 0.8,
      textTransform: 'uppercase',
      background: '#8AE8D4',
      color: 'white',
      marginRight: theme.spacing.unit * 1.5,
    },
  })

const withTransactionByHash = graphql(GET_TRANSACTION_BY_HASH, {
  name: 'transaction',
  options: ({txHash}) => ({
    variables: {txHash},
  }),
})

const withCurrentBlockCount = graphql(GET_CURRENT_BLOCK_COUNT, {
  name: 'blockCount',
})

// TODO: Ignore commented code, Inputs and Outputs will be done in next PR
// const TransactionInput = ({txInput}) => (
//   <React.Fragment>
//     <div className={classes.movementField}>
//       <div>Address</div>
//       <div>{txInput.address58}</div>
//     </div>
//     <div className={classes.movementField}>
//       <div>Amount</div>
//       <div>{txInput.amount}</div>
//     </div>
//   </React.Fragment>
// )

// const TransactionOutput = ({txOutput}) => (
//   <React.Fragment>
//     <div className={classes.movementField}>
//       <div>Address</div>
//       <div>{txOutput.address58}</div>
//     </div>
//     <div className={classes.movementField}>
//       <div>Amount</div>
//       <div>{txOutput.amount}</div>
//     </div>
//   </React.Fragment>
// )
// <h4>General</h4>
// {generalTransactionInfoConfig.map((field) => (
//   <div key={field.title} className={classes.generalField}>
//     <div>{field.title}</div>
//     <div>{field.getValue(transaction)}</div>
//   </div>
// ))}

// <h4>Inputs</h4>
// {transaction.inputs.map((input, index) => (
//   <TransactionInput key={index} txInput={input} />
// ))}

// <h4>Outputs</h4>
// {transaction.outputs.map((output, index) => (
//   <TransactionOutput key={index} txOutput={output} />
// ))}

// TODO: extract to own reusable component in next PR

const HrSeparatedList = withStyles(styles)(({children, classes}) => {
  return (
    <div className={classes.listWrapper}>
      {children.map((row) => {
        return (
          <div key={row.toString()} className={classes.listRow}>
            {row}
          </div>
        )
      })}
    </div>
  )
})

const Transaction = (props) => {
  const {classes} = props
  const {loading, transaction} = props.transaction
  const {loading: blockCountLoading, currentStatus} = props.blockCount
  const {translate, formatAda, formatInt} = getIntlFormatters(props.intl)
  // TODO: 'loading' check inside 'compose' once we have loading component
  if (loading || blockCountLoading) {
    return null
  }

  return (
    <div className={classes.wrapper}>
      <h1>{translate(messages.header)}</h1>

      <Card className={classes.card}>
        <div className={classes.adaIcon}>
          <img src={AdaIcon} width={40} height={40} />
        </div>
        <div className={classes.cardContent}>
          <div>{translate(messages.transactionId)}</div>
          <div className={classes.cardRow}>
            <span>{transaction.txHash}</span>
            <span>
              <img src={CopyIcon} width={30} height={30} />
            </span>
          </div>
        </div>
      </Card>

      <Card className={classes.card}>
        <HrSeparatedList>
          <div className={classes.rowItem}>
            <div>{translate(messages.assuranceLevel)}</div>
            <div>
              {/* TODO finish possible labels high/medium/low */}
              <Chip label="High" className={classes.chip} />
              <span>
                {currentStatus && formatInt(currentStatus.blockCount - transaction.blockSlot)}{' '}
                {translate(messages.confirmations)}
              </span>
            </div>
          </div>
          <div className={classes.rowItem}>
            <div>{translate(messages.epoch)}</div>
            <div>{formatInt(transaction.blockEpoch)}</div>
          </div>
          <div className={classes.rowItem}>
            <div>{translate(messages.slot)}</div>
            <div>{formatInt(transaction.blockSlot)}</div>
          </div>
          <div className={classes.rowItem}>
            <div>{translate(messages.date)}</div>
            <div>{moment(transaction.txTimeIssued).format('l LTS')}</div>
          </div>
          <div className={classes.rowItem}>
            <div>{translate(messages.size)}</div>
            <div>{transaction.size || 'TODO'}</div>
          </div>
          <div className={classes.rowItem}>
            <div>{translate(messages.fees)}</div>
            <div>{`${formatAda(transaction.fees)} ADA`}</div>
          </div>
        </HrSeparatedList>
      </Card>
    </div>
  )
}

export default compose(
  withRouter,
  withProps((props) => ({
    txHash: props.match.params.txHash,
    // blockCount: props.blockCount.currentStatus.blockCount,
  })),
  withTransactionByHash,
  withCurrentBlockCount,
  injectIntl,
  withStyles(styles)
)(Transaction)
