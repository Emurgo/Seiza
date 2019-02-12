// @flow
import {gql} from 'apollo-server'

export default gql`
  type Address {
    address58: ID!
    type: String!
    transactionsCount: Int
    balance: String
    transactions: [Transaction]
  }

  type Query {
    address(address58: String): Address
  }
`
