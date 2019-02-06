import {gql} from 'apollo-server'

export default gql`
  type AddressTransaction {
    id: ID
    timeIssued: Timestamp
    inputs: [TransactionInput]
    outputs: [TransactionOutput]
  }

  type Address {
    id: ID
    type: String
    txNum: Int
    balance: String
    transactions: [AddressTransaction]
  }

  type Query {
    address(id: String): Address
  }
`
