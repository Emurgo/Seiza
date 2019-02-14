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
    txTimeIssued: Timestamp
    blockTimeIssued: Timestamp
    blockHeight: Int
    blockEpoch: Int
    blockSlot: Int
    blockHash: String
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
