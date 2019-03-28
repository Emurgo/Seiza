import {fetchAllTimeStakingSummary, fetchPerEpochStakingSummary} from './dataProviders'

export default {
  Query: {
    allTimeStakingSummary: (root, args, context) => fetchAllTimeStakingSummary(null),
    perEpochStakingSummary: (root, args, context) => fetchPerEpochStakingSummary(null, args.epoch),
  },
}
