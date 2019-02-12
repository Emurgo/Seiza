// @flow

import React from 'react'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {withProps} from 'recompose'
import {withRouter} from 'react-router'

import {GET_TRANSACTION_BY_HASH} from '../../api/queries'

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
    title: 'hash',
    getValue: (transaction) => transaction.txHash,
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

const withTransactionByHash = graphql(GET_TRANSACTION_BY_HASH, {
  name: 'transaction',
  options: ({txHash}) => ({
    variables: {txHash},
  }),
})

const TransactionInput = ({txInput}) => (
  <React.Fragment>
    <div style={styles.movementField}>
      <div>Address</div>
      <div>{txInput.address58}</div>
    </div>
    <div style={styles.movementField}>
      <div>Amount</div>
      <div>{txInput.amount}</div>
    </div>
  </React.Fragment>
)

const TransactionOutput = ({txOutput}) => (
  <React.Fragment>
    <div style={styles.movementField}>
      <div>Address</div>
      <div>{txOutput.address58}</div>
    </div>
    <div style={styles.movementField}>
      <div>Amount</div>
      <div>{txOutput.amount}</div>
    </div>
  </React.Fragment>
)

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
      {transaction.inputs.map((input, index) => (
        <TransactionInput key={index} txInput={input} />
      ))}

      <h4>Outputs</h4>
      {transaction.outputs.map((output, index) => (
        <TransactionOutput key={index} txOutput={output} />
      ))}
    </div>
  )
}

export default compose(
  withRouter,
  withProps((props) => ({
    txHash: props.match.params.txHash,
  })),
  withTransactionByHash
)(Transaction)
