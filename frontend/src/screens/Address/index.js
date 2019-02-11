// @flow

import React from 'react'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {withProps} from 'recompose'
import {withRouter} from 'react-router'
import {Link} from 'react-router-dom'

import {routeTo} from '../../helpers/routes'
import {GET_ADDRESS_BY_ID} from '../../api/queries'

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
}

const generalAddressInfoConfig = [
  {
    title: 'ID',
    getValue: (address) => address.id,
  },
  {
    title: 'type',
    getValue: (address) => address.type,
  },
  {
    title: 'transactionsCount',
    getValue: (address) => address.transactionsCount,
  },
  {
    title: 'balance',
    getValue: (address) => address.transactionsCount,
  },
]

const withAddressById = graphql(GET_ADDRESS_BY_ID, {
  name: 'address',
  options: ({addressId}) => ({
    variables: {addressId},
  }),
})

const TransactionsList = ({transactions}) =>
  transactions.map(({id}) => (
    <Link key={id} to={routeTo.transaction(id)}>
      {id}
    </Link>
  ))

const Address = (props) => {
  const {loading, address} = props.address
  // TODO: 'loading' check inside 'compose' once we have loading component
  if (loading) {
    return null
  }
  return (
    <div style={styles.wrapper}>
      <h4>General</h4>
      {generalAddressInfoConfig.map((field) => (
        <div key={field.title} style={styles.generalField}>
          <div>{field.title}</div>
          <div>{field.getValue(address)}</div>
        </div>
      ))}

      <h4>Transactions</h4>
      <TransactionsList transactions={address.transactions} />
    </div>
  )
}

export default compose(
  withRouter,
  withProps((props) => ({
    addressId: props.match.params.id,
  })),
  withAddressById
)(Address)
