import {gql} from 'apollo-server'

export default gql`
  # TODO: decide on better structure of price
  # TODO: is this midpoint price?
  type Price {
    usd: Float
    eur: Float
  }

  # Not sure if Status is a good name
  type Status {
    epochNumber: Int
    blockCount: Int
    decentralization: Float # todo scalar fraction
    price: Price
    stakePoolCount: Int
  }

  type Query {
    currentStatus: Status
  }
`
