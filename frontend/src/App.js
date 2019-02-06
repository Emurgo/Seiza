import React from 'react'
import './App.css'
import {graphql} from 'react-apollo'
import {GET_TRANSACTION_BY_ID} from './api/queries'

const txId = 'ef90f4873a27fdb64d09d58447e39f6b855cecd6303188f9648349fdc876592b'

const withTransactionById = graphql(GET_TRANSACTION_BY_ID, {
  name: 'transaction',
  options: () => ({
    variables: {txId},
  }),
})

const App = (props) => {
  const {loading, transaction} = props.transaction
  return (
    <>
      <h1>Welcome to Seiza!</h1>
      <h2>Cardano's next generation blockchain explorer.</h2>
      <p>{!loading && JSON.stringify(transaction, null, 4)}</p>
    </>
  )
}

export default withTransactionById(App)
