// @flow

// TODO: unify properties naming with the rest endpoints once the final fields are determined

export type SlotInfo = {|
  supply: string,
  txCount: number,
  totalSent: string,
  totalFees: string,
|}

export type GeneralInfo = {|
  blocksCount: number,
  txCount: number,
  movements: string,
  totalFees: string,
  emptySlotsCount: number,
  addresses: string,
|}

export type EpochInfo = GeneralInfo

const mockedSlotInfo: SlotInfo = {
  supply: '30379712132694',
  txCount: 12,
  totalSent: '1234',
  totalFees: '12',
}

const mockedGeneralInfo: GeneralInfo = {
  blocksCount: 2183881,
  txCount: 21343454,
  movements: '7084878665513',
  totalFees: '328203',
  emptySlotsCount: 323,
  addresses: '4324324',
}

export const fetchGeneralInfo = (api: any, period: string): Promise<GeneralInfo> => {
  return Promise.resolve(mockedGeneralInfo)
}

export const fetchEpochInfo = (api: any, epoch: number): Promise<EpochInfo> => {
  return Promise.resolve(mockedGeneralInfo)
}

export const fetchSlotInfo = (api: any, epoch: number, slot: number): Promise<SlotInfo> => {
  return Promise.resolve(mockedSlotInfo)
}
