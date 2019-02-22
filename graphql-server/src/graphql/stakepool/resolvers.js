import {fetchBootstrapEraPool} from './dataProviders'

export default {
  Query: {
    stakePool: (root, args, context) => fetchBootstrapEraPool(null, args.poolHash),
  },
}
