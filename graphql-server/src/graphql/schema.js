import {gql} from 'apollo-server'
import {mergeTypes} from 'merge-graphql-schemas'

import activecampaignSchema from './activecampaign/schema.gql'
import transactionSchema from './transaction/types'
import addressSchema from './address/schema.gql'
import blockSchema from './block/schema.gql'
import statusSchema from './status/schema.gql'
import searchSchema from './search/schema.gql'
import stakePoolSchema from './stakepool/schema.gql'
import marketSchema from './market/schema.gql'
import generalInfoSchema from './general/schema.gql'
import epochSchema from './epoch/schema.gql'
import stakepoolsSchema from './stakingInfo/schema.gql'

const globalTypes = gql`
  scalar Timestamp
  scalar AdaAmount
  scalar URL

  # Note(ppershing): this should be
  # multipliers: [String | Int] but gql does not support
  # scalar union and String seems to work even for Ints
  directive @cost(complexity: Int, multipliers: [String]) on FIELD | OBJECT | FIELD_DEFINITION
`

export default mergeTypes(
  [
    globalTypes,
    activecampaignSchema,
    addressSchema,
    transactionSchema,
    blockSchema,
    statusSchema,
    searchSchema,
    stakePoolSchema,
    marketSchema,
    generalInfoSchema,
    epochSchema,
    stakepoolsSchema,
  ],
  {
    all: true,
  }
)
