/* @flow */

export type AdaAmount = any;

export type Address = {
  address58: string,
  type: string,
  transactionsCount?: ?number,
  transactions?: ?Array<?Transaction>,
  totalAdaSent?: ?AdaAmount,
  totalAdaReceived?: ?AdaAmount,
  balance?: ?AdaAmount
};

export type AggregateInfo = {
  txCount: Series,
  totalAdaTransferred: Series,
  totalUtxoCreated: Series
};

export type AllTimeStakingSummary = {
  blocksCreated: number,
  blocksMissed: number,
  totalPoolsCreated: number
};

export type Block = {
  blockHash?: ?string,
  epoch: number,
  slot: number,
  timeIssued: Timestamp,
  transactionsCount: number,
  transactions?: ?Array<Transaction>,
  totalSent: AdaAmount,
  totalFees: AdaAmount,
  size: number,
  blockLeader?: ?BootstrapEraStakePool,
  blockHeight?: ?number,
  blockConfirmations?: ?number,
  previousBlock?: ?Block,
  nextBlock?: ?Block,
  isEmpty: boolean
};

export type BlockChainSearchItem = Block | Transaction | Address | Epoch;

export type BlockChainSearchResult = {
  items: Array<BlockChainSearchItem>
};

export type BootstrapEraStakePool = {
  poolHash: string,
  name?: ?string,
  description?: ?string,
  summary?: ?StakePoolSummary,
  createdAt: Timestamp,
  website: Url
};

export const CacheControlScopeValues = Object.freeze({
  Public: "PUBLIC",
  Private: "PRIVATE"
});

export type CacheControlScope = $Values<typeof CacheControlScopeValues>;

export const CurrencyEnumValues = Object.freeze({
  Usd: "USD",
  Eur: "EUR",
  Jpy: "JPY"
});

export type CurrencyEnum = $Values<typeof CurrencyEnumValues>;

export type Date = any;

export type Epoch = {
  epochNumber: number,
  startTime: Timestamp,
  endTime: Timestamp,
  progress: number,
  summary?: ?EpochSummary
};

export type EpochSummary = {
  slotCount: number,
  blocksCreated: number,
  transactionCount: number,
  totalAdaSupply: AdaAmount,
  epochFees: AdaAmount,
  totalAdaStaked: AdaAmount,
  stakingRewards: AdaAmount,
  delegatingStakingKeysCount: number,
  activeStakingPoolCount: number
};

export type GeneralInfo = {
  blocksCount: number,
  txCount: number,
  movements?: ?AdaAmount,
  totalFees?: ?AdaAmount,
  emptySlotsCount?: ?number,
  addresses?: ?AdaAmount
};

export const InfoPeriodValues = Object.freeze({
  All_Time: "ALL_TIME",
  Last_24_Hours: "LAST_24_HOURS"
});

export type InfoPeriod = $Values<typeof InfoPeriodValues>;

export type MarketHistoryResult = {
  data: Array<Ohlcv>
};

export type Ohlcv = {
  timePeriod: OhlcvTimePeriod,
  price?: ?OhlcvPrice
};

export type OhlcvPrice = {
  open?: ?number,
  close?: ?number,
  low?: ?number,
  high?: ?number
};

export type OhlcvTimePeriod = {
  open: Timestamp,
  close: Timestamp
};

export type OwnerPledge = {
  declared?: ?AdaAmount,
  actual?: ?AdaAmount
};

export type PagedBlocksResult = {
  cursor?: ?number,
  hasMore: boolean,
  blocks: Array<?Block>
};

export type PagedStakePoolsResult = {
  cursor?: ?string,
  hasMore: boolean,
  stakePools: Array<?BootstrapEraStakePool>,
  totalCount: number
};

export type PerEpochStakingSummary = {
  totalStakedAmount: AdaAmount,
  poolsCount: number,
  totalBlocksCreated: number,
  totalBlocksMissed: number,
  rewardsPerBlock: AdaAmount
};

export type PerformanceInterval = {
  from: number,
  to: number
};

export type Point = {
  x?: ?string,
  y?: ?number
};

export type Query = {
  address?: ?Address,
  transaction?: ?Transaction,
  pagedBlocks: PagedBlocksResult,
  pagedBlocksInEpoch: PagedBlocksResult,
  block?: ?Block,
  slot?: ?Block,
  currentStatus: Status,
  blockChainSearch: BlockChainSearchResult,
  stakePoolList: BootstrapEraStakePool,
  pagedStakePoolList: PagedStakePoolsResult,
  stakePool?: ?BootstrapEraStakePool,
  stakePools?: ?Array<?BootstrapEraStakePool>,
  marketHistory?: ?MarketHistoryResult,
  generalInfo: GeneralInfo,
  epochInfo: GeneralInfo,
  slotInfo: SlotInfo,
  aggregateInfo: AggregateInfo,
  epoch: Epoch,
  allTimeStakingSummary: AllTimeStakingSummary,
  perEpochStakingSummary: PerEpochStakingSummary
};

export type QueryAddressArgs = {
  address58: string
};

export type QueryTransactionArgs = {
  txHash?: ?string
};

export type QueryPagedBlocksArgs = {
  cursor?: ?number
};

export type QueryPagedBlocksInEpochArgs = {
  epochNumber: number,
  cursor?: ?number
};

export type QueryBlockArgs = {
  blockHash: string
};

export type QuerySlotArgs = {
  epoch?: ?number,
  slot?: ?number
};

export type QueryBlockChainSearchArgs = {
  query: string
};

export type QueryStakePoolListArgs = {
  epochNumber?: ?number
};

export type QueryPagedStakePoolListArgs = {
  cursor?: ?string,
  pageSize?: ?number,
  searchOptions: StakePoolSearchOptions
};

export type QueryStakePoolArgs = {
  poolHash: string,
  epochNumber?: ?number
};

export type QueryStakePoolsArgs = {
  poolHashes: Array<string>,
  epochNumber?: ?number
};

export type QueryMarketHistoryArgs = {
  currency: CurrencyEnum
};

export type QueryGeneralInfoArgs = {
  infoPeriod?: ?InfoPeriod
};

export type QueryEpochInfoArgs = {
  epoch: number
};

export type QuerySlotInfoArgs = {
  epoch: number,
  slot: number
};

export type QueryAggregateInfoArgs = {
  groupBy: SeriesXAxisGroupBy,
  epochInterval?: ?SeriesEpochInterval,
  dateInterval?: ?SeriesDateInterval
};

export type QueryEpochArgs = {
  epochNumber: number
};

export type QueryPerEpochStakingSummaryArgs = {
  epoch: number
};

export type Series = {
  data: Array<Point>
};

export type SeriesDateInterval = {
  from: ?Timestamp,
  to: ?Timestamp
};

export type SeriesEpochInterval = {
  from: ?number,
  to: ?number
};

export const SeriesXAxisGroupByValues = Object.freeze({
  Epoch: "EPOCH",
  Day: "DAY"
});

export type SeriesXAxisGroupBy = $Values<typeof SeriesXAxisGroupByValues>;

export type SlotInfo = {
  supply: AdaAmount,
  txCount: number,
  totalSent: AdaAmount,
  totalFees: AdaAmount
};

export type StakePoolSearchOptions = {
  sortBy: StakePoolSortByEnum,
  searchText: ?string,
  performance: ?PerformanceInterval
};

export const StakePoolSortByEnumValues = Object.freeze({
  Revenue: "REVENUE",
  Performance: "PERFORMANCE",
  Fullness: "FULLNESS",
  Pledge: "PLEDGE",
  Margins: "MARGINS",
  Stake: "STAKE"
});

export type StakePoolSortByEnum = $Values<typeof StakePoolSortByEnumValues>;

export type StakePoolSummary = {
  performance?: ?number,
  adaStaked?: ?AdaAmount,
  rewards?: ?AdaAmount,
  keysDelegating?: ?number,
  fullness?: ?number,
  margins?: ?number,
  pledge?: ?AdaAmount,
  revenue?: ?number,
  stakersCount?: ?number,
  ownerPledge?: ?OwnerPledge,
  usersAdaStaked?: ?AdaAmount,
  averageUserStaking?: ?AdaAmount
};

export type Status = {
  epochNumber: number,
  blockCount: number,
  latestBlock: Block,
  decentralization?: ?number,
  price: number,
  stakePoolCount?: ?number,
  dataAvailableUpTo: Timestamp,
  currentTime: Timestamp
};

export type StatusPriceArgs = {
  currency: CurrencyEnum
};

export type Timestamp = any;

export type Transaction = {
  txHash: string,
  block: Block,
  totalInput: AdaAmount,
  totalOutput: AdaAmount,
  fees: AdaAmount,
  inputs: Array<TransactionInput>,
  outputs: Array<TransactionOutput>,
  confirmationsCount: number,
  size: number
};

export type TransactionInput = {
  address58: string,
  amount: AdaAmount
};

export type TransactionOutput = {
  address58: string,
  amount: AdaAmount
};

export type Upload = any;

export type Url = any;
type $Pick<Origin: Object, Keys: Object> = $ObjMapi<
  Keys,
  <Key>(k: Key) => $ElementType<Origin, Key>
>;
