import {fetchEpoch} from './dataProviders'

export default {
  Query: {
    epoch: (root, args, context) => fetchEpoch(null, args.epochNumber),
  },
}
