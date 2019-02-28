import {fetchBootstrapEraPool, fetchBootstrapEraPoolList} from './dataProviders'

export default {
  Query: {
    stakePool: (root, args, context) =>
      fetchBootstrapEraPool(null, args.poolHash, args.epochNumber),
    stakePoolList: (root, args, context) => fetchBootstrapEraPoolList(null, args.epochNumber),
  },
}
