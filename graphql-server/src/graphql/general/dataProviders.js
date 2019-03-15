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
  supply: '31,000,000,000.000000'.replace(/[,.]/g, ''),
  txCount: 12,
  totalSent: '1234025436',
  totalFees: '12003125',
}

const mockedGeneralInfo = (x): GeneralInfo => ({
  blocksCount: Math.floor(4123.4312431243124123 * x),
  txCount: Math.floor(12345.5435234523 * x),
  movements: '7084878665513',
  totalFees: '328203',
  emptySlotsCount: Math.floor(432.315452345423 * x),
  addresses: '12345',
})

export const fetchGeneralInfo = (api: any, period: string): Promise<GeneralInfo> => {
  return Promise.resolve(mockedGeneralInfo(period === 'LAST_24_HOURS' ? 1 : 300))
}

export const fetchEpochInfo = (api: any, epoch: number): Promise<EpochInfo> => {
  return Promise.resolve(mockedGeneralInfo(5))
}

export const fetchSlotInfo = (api: any, epoch: number, slot: number): Promise<SlotInfo> => {
  return Promise.resolve(mockedSlotInfo)
}
