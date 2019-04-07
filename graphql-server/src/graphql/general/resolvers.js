// @flow
import {fetchGeneralInfo, fetchSlotInfo, fetchEpochInfo} from './dataProviders'
import {parseAdaValue} from '../utils'

const fetchSupplyAfterSlot = async ({elastic, E}, {epoch, slot}) => {
  const hit = await elastic
    .q('tx')
    .filter(E.lte('epoch', epoch))
    .filter(E.lte('slot', slot))
    .sortBy('epoch', 'desc')
    .sortBy('slot', 'desc')
    .sortBy('tx_ordinal', 'desc')
    .getFirstHit()

  return parseAdaValue(hit._source.supply_after_this_tx)
}

export default {
  Query: {
    generalInfo: (root: any, args: any, context: any) => fetchGeneralInfo(context, args.infoPeriod),
    epochInfo: (root: any, args: any, context: any) => fetchEpochInfo(context, args.epoch),
    slotInfo: (root: any, args: any, context: any) => fetchSlotInfo(context, args.epoch, args.slot),
  },
  SlotInfo: {
    supply: (slotInfo: any, args: any, context: any) =>
      fetchSupplyAfterSlot(context, slotInfo.__epoch_slot),
  },
}
