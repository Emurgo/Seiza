import {fetchGeneralInfo, fetchSlotInfo, fetchEpochInfo} from './dataProviders'

export default {
  Query: {
    generalInfo: (root, args, context) => fetchGeneralInfo(null, args.infoPeriod),
    epochInfo: (root, args, context) => fetchEpochInfo(null, args.epoch),
    slotInfo: (root, args, context) => fetchSlotInfo(null, args.epoch, args.slot),
  },
}
