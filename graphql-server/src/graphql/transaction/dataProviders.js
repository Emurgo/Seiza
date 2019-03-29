// @flow
import {parseAdaValue, annotateNotFoundError} from '../utils'

export const facadeTransaction = (source: any) => {
  return {
    txHash: source.hash,
    _epoch_slot: {epoch: source.epoch, slot: source.slot},
    totalInput: parseAdaValue(source.sum_inputs),
    totalOutput: parseAdaValue(source.sum_outputs),
    // TODO: what about refunds?
    fees: parseAdaValue(source.fees),

    // TODO: this is a hack for now
    inputs: source.inputs.map((input) => ({
      address58: input.address,
      amount: parseAdaValue(input.value),
    })),
    outputs: source.outputs.map((output) => ({
      address58: output.address,
      amount: parseAdaValue(output.value),
    })),

    // TODO: tx size is missing in data
    size: null,
    supplyAfter: parseAdaValue(source.supply_after_this_tx),
  }
}

export const fetchTransaction = async ({elastic, E}: any, txHash: string) => {
  const hit = await elastic
    .q('tx')
    // todo: filter on active fork?
    .filter(E.matchPhrase('hash', txHash))
    .getSingleHit()
    .catch(annotateNotFoundError({elasticType: 'tx', entity: 'Transaction'}))
  return facadeTransaction(hit._source)
}
