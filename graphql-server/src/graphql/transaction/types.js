// @flow
import {gql} from 'apollo-server'

export default gql`
  type TransactionInput {
    address58: String
    amount: AdaAmount
  }

  type TransactionOutput {
    address58: String
    amount: AdaAmount
  }

  type Transaction {
    txHash: ID!
    block: Block
    totalInput: AdaAmount
    totalOutput: AdaAmount
    fees: AdaAmount
    inputs: [TransactionInput]
    outputs: [TransactionOutput]
    confirmationsCount: Int
    size: Int
  }

  type Query {
    transaction(txHash: String): Transaction
  }
`
