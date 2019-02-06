import React from 'react'
import {graphql} from 'react-apollo'
import {GET_TRANSACTION_BY_ID} from '../../api/queries'

const txId = 'ef90f4873a27fdb64d09d58447e39f6b855cecd6303188f9648349fdc876592b'
const withTransactionById = graphql(GET_TRANSACTION_BY_ID, {
  name: 'transaction',
  options: () => ({
    variables: {txId},
  }),
})

const Blockchain = (props) => {
  const {loading, transaction} = props.transaction
  return (
    <React.Fragment>
      <h1>Blockchain</h1>
      <h2>Enjoy looking on the json of the transaction.</h2>
      <p>{!loading && JSON.stringify(transaction, null, 4)}</p>
    </React.Fragment>
  )
}

export default withTransactionById(Blockchain)
