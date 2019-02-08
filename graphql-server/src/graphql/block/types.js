import {gql} from 'apollo-server'

// TODO: Fetch more detailed info about block using '/api/blocks/summary/{hash}'

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

  type BlockConnection {
    cursor: String!
    hasMore: Boolean!
    blocks: [Block]!
  }

  type Query {
    blocks(after: String): BlockConnection!
  }
`
