// @flow

import gql from 'graphql-tag'

export const GET_TRANSACTION_BY_HASH = gql`
  query($txHash: String!) {
    transaction(txHash: $txHash) {
      txHash
      txTimeIssued
      blockTimeIssued
      blockHeight
      blockEpoch
      blockSlot
      blockHash
      totalInput
      totalOutput
      fees
      inputs {
        address58
        amount
      }
      outputs {
        address58
        amount
      }
    }
  }
`

export const BLOCK_INFO_FRAGMENT = gql`
  fragment BasicBlockInfo on Block {
    blockHash
    epoch
    slot
    timeIssued
    transactionsCount
    totalSend
    size
    blockLead
    totalFees
  }
`

export const GET_PAGED_BLOCKS = gql`
  query($cursor: Int) {
    pagedBlocks(cursor: $cursor) {
      blocks {
        ...BasicBlockInfo
      }
      cursor
      hasMore
    }
  }
  ${BLOCK_INFO_FRAGMENT}
`

export const GET_ADDRESS_BY_ADDRESS58 = gql`
  query($address58: String!) {
    address(address58: $address58) {
      address58
      type
      transactionsCount
      balance
      transactions {
        txHash
      }
    }
  }
`
