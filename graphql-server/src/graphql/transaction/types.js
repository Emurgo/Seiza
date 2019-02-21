// @flow
import {gql} from 'apollo-server'

export default gql`
  type TransactionInput {
    address58: String
    amount: String
  }

  type TransactionOutput {
    address58: String
    amount: String
  }

  type Transaction {
    txHash: ID!
    block: Block
    totalInput: String
    totalOutput: String
    fees: String
    inputs: [TransactionInput]
    outputs: [TransactionOutput]
    confirmationsCount: Int
  }

  type Query {
    transaction(txHash: String): Transaction
  }
`
