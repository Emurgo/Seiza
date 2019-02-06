import {gql} from 'apollo-server'

export default gql`
  type Address {
    id: ID
    type: String
    transactionsCount: Int
    balance: String
    transactions: [Transaction]
  }

  type Query {
    address(id: String): Address
  }
`
