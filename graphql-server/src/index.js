import {ApolloServer, gql} from 'apollo-server'
import {cardanoAPI} from './api'
const BigInt = require('graphql-bigint')

// TODO: global error handler

const typeDefs = gql`
  scalar Timestamp

  type TransactionInput {
    from: String
    amount: String
  }

  type TransactionOutput {
    to: String
    amount: String
  }

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

  # The "Query" type is the root of all GraphQL queries.
  type Query {
    transaction(id: String): Transaction
  }
`

// TODO: move to suitable folder
const transactionResolver = (parent, args, context) =>
  context.cardanoAPI.get(`txs/summary/${args.id}`).then(({data}) => {
    const d = data.Right
    const ret = {
      id: d.ctsId,
      txTimeIssued: d.ctsTxTimeIssued,
      blockTimeIssued: d.ctsBlockTimeIssued,
      blockHeight: d.ctsBlockHeight,
      blockEpoch: d.ctsBlockEpoch,
      blockSlot: d.ctsBlockSlot,
      blockHash: d.ctsBlockHash,
      totalInput: d.ctsTotalInput.getCoin,
      totalOutput: d.ctsTotalOutput.getCoin,
      fees: d.ctsFees.getCoin,
      inputs: d.ctsInputs.map((input) => ({
        from: input[0],
        amount: input[1].getCoin,
      })),
      outputs: d.ctsInputs.map((output) => ({
        to: output[0],
        amount: output[1].getCoin,
      })),
    }
    return ret
  })

const resolvers = {
  Timestamp: BigInt,
  Query: {
    transaction: (...args) => transactionResolver(...args),
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    cardanoAPI,
  }),
})

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url}`) // eslint-disable-line
})
