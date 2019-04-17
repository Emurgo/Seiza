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

export type Block = {
  blockHash: string,
  epoch: number,
  slot: number,
  timeIssued: Timestamp,
  transactionsCount: number,
  transactions?: ?Array<Transaction>,
  totalSent: AdaAmount,
  totalFees: AdaAmount,
  size: number,
  blockLeader: BootstrapEraStakePool,
  blockHeight?: ?number,
  blockConfirmations?: ?number
};

export type BlockChainSearchItem = Block | Transaction | Address;

export type BlockChainSearchResult = {
  items: Array<BlockChainSearchItem>
};

export type BootstrapEraStakePool = {
  poolHash: string,
  name?: ?string,
  description?: ?string
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

export type PagedBlocksResult = {
  cursor?: ?number,
  hasMore: boolean,
  blocks: Array<?Block>
};

export type Query = {
  address?: ?Address,
  transaction?: ?Transaction,
  pagedBlocks: PagedBlocksResult,
  block?: ?Block,
  currentStatus?: ?Status,
  blockChainSearch: BlockChainSearchResult,
  stakePoolList?: ?Array<?BootstrapEraStakePool>,
  stakePool?: ?BootstrapEraStakePool,
  marketHistory?: ?MarketHistoryResult
};

export type QueryAddressArgs = {
  address58?: ?string
};

export type QueryTransactionArgs = {
  txHash?: ?string
};

export type QueryPagedBlocksArgs = {
  cursor?: ?number
};

export type QueryBlockArgs = {
  blockHash: string
};

export type QueryBlockChainSearchArgs = {
  query: string
};

export type QueryStakePoolArgs = {
  poolHash: string
};

export type QueryMarketHistoryArgs = {
  currency: CurrencyEnum
};

export type Status = {
  epochNumber?: ?number,
  blockCount?: ?number,
  decentralization?: ?number,
  price?: ?number,
  stakePoolCount?: ?number
};

export type StatusPriceArgs = {
  currency: CurrencyEnum
};

export type Timestamp = any;

export type Transaction = {
  txHash: string,
  block?: ?Block,
  totalInput?: ?string,
  totalOutput?: ?string,
  fees?: ?string,
  inputs?: ?Array<?TransactionInput>,
  outputs?: ?Array<?TransactionOutput>,
  confirmationsCount?: ?number,
  size?: ?number
};

export type TransactionInput = {
  address58?: ?string,
  amount?: ?string
};

export type TransactionOutput = {
  address58?: ?string,
  amount?: ?string
};

export type Upload = any;
type $Pick<Origin: Object, Keys: Object> = $ObjMapi<
  Keys,
  <Key>(k: Key) => $ElementType<Origin, Key>
>;
