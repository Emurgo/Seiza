// @flow

import React from 'react'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {withProps} from 'recompose'
import {withRouter} from 'react-router'

import {GET_TRANSACTION_BY_ID} from '../../api/queries'

// TODO: flow
// TODO: very temporary styles
const styles = {
  wrapper: {
    width: '1400px',
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
}

const generalTransactionInfoConfig = [
  {
    title: 'ID',
    getValue: (transaction) => transaction.id,
  },
  {
    title: 'txTimeIssued',
    getValue: (transaction) => transaction.txTimeIssued,
  },
  {
    title: 'blockTimeIssued',
    getValue: (transaction) => transaction.blockTimeIssued,
  },
  {
    title: 'blockHeight',
    getValue: (transaction) => transaction.blockHeight,
  },
  {
    title: 'blockEpoch',
    getValue: (transaction) => transaction.blockEpoch,
  },
  {
    title: 'blockSlot',
    getValue: (transaction) => transaction.blockSlot,
  },
  {
    title: 'blockHash',
    getValue: (transaction) => transaction.blockHash,
  },
  {
    title: 'totalInput',
    getValue: (transaction) => transaction.totalInput,
  },
  {
    title: 'totalOutput',
    getValue: (transaction) => transaction.totalOutput,
  },
  {
    title: 'fees',
    getValue: (transaction) => transaction.fees,
  },
]

const withTransactionById = graphql(GET_TRANSACTION_BY_ID, {
  name: 'transaction',
  options: ({txId}) => ({
    variables: {txId},
  }),
})

const TransactionMovements = ({movements}) => movements.map((move, index) => (
  <div key={index}>
    <div style={styles.movementField}>
      <div>Address</div>
      <div>{move.address58}</div>
    </div>
    <div style={styles.movementField}>
      <div>Amount</div>
      <div>{move.amount}</div>
    </div>
  </div>
))

const Transaction = (props) => {
  const {loading, transaction} = props.transaction
  // TODO: 'loading' check inside 'compose' once we have loading component
  if (loading) {
    return null
  }
  return (
    <div style={styles.wrapper}>
      <h4>General</h4>
      {generalTransactionInfoConfig.map((field) => (
        <div key={field.title} style={styles.generalField}>
          <div>{field.title}</div>
          <div>{field.getValue(transaction)}</div>
        </div>
      ))}

      <h4>Inputs</h4>
      <TransactionMovements movements={transaction.inputs} />

      <h4>Outputs</h4>
      <TransactionMovements movements={transaction.outputs} />
    </div>
  )
}

export default compose(
  withRouter,
  withProps((props) => ({
    txId: props.match.params.id,
  })),
  withTransactionById
)(Transaction)
