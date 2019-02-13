import {gql} from 'apollo-server'

// TODO: Fetch more detailed info about block using '/api/blocks/summary/{hash}'

export default gql`
  type Block {
    epoch: Int!
    slot: Int!
    blockHash: String!
    timeIssued: Timestamp!
    transactionsCount: Int!
    totalSend: AdaAmount!
    size: Int!
    blockLead: String!
    totalFees: AdaAmount!
  }

  type PagedBlocksResult {
    cursor: Int!
    hasMore: Boolean!
    blocks: [Block]!
  }

  type Query {
    blocks(cursor: Int): PagedBlocksResult!
  }
`
