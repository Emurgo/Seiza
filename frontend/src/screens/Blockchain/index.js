import React from 'react'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {injectIntl, defineMessages} from 'react-intl'

import {GET_TRANSACTION_BY_ID} from '../../api/queries'

const messages = defineMessages({
  title: {
    id: 'app.title',
    defaultMessage: 'Welcome to Seiza!',
  },
})

const txId = 'ef90f4873a27fdb64d09d58447e39f6b855cecd6303188f9648349fdc876592b'
const withTransactionById = graphql(GET_TRANSACTION_BY_ID, {
  name: 'transaction',
  options: () => ({
    variables: {txId},
  }),
})

const Blockchain = (props) => {
  const {loading, transaction} = props.transaction
  const {
    intl: {formatMessage},
  } = props
  return (
    <React.Fragment>
      <h1>Blockchain</h1>
      {formatMessage(messages.title)}
      <h2>Enjoy looking on the json of the transaction.</h2>
      <p>{!loading && JSON.stringify(transaction, null, 4)}</p>
    </React.Fragment>
  )
}

export default compose(
  injectIntl,
  withTransactionById
)(Blockchain)
