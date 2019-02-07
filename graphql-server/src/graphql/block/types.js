import {gql} from 'apollo-server'

// TODO change Timestamp to moment
export default gql`
  type Block {
    epoch: Int
    slot: Int
    blockHash: String
    timeIssued: Timestamp
    transactionsCount: Int
    totalSend: String
    size: Int
    blockLead: String
    fees: String
  }

  type Query {
    blocks: [Block]
  }
`
