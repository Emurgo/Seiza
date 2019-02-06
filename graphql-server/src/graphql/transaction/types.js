import {gql} from 'apollo-server'

export default gql`
  type Transaction {
    id: ID
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
  }

  type Query {
    transaction(id: String): Transaction
  }
`
