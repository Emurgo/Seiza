// @flow

import gql from 'graphql-tag'

export const GET_TRANSACTION_BY_HASH = gql`
  query($txHash: String!) {
    transaction(txHash: $txHash) {
      txHash
      block {
        timeIssued
        blockHeight
        epoch
        slot
        blockHash
      }
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
      confirmationsCount
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
    blockLeader {
      poolHash
      name
    }
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

export const GET_BLOCK_BY_HASH = gql`
  query($blockHash: String!) {
    block(blockHash: $blockHash) {
      ...BasicBlockInfo
      transactions {
        txHash
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
        confirmationsCount
      }
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
      totalAdaSent
      totalAdaReceived
      transactions {
        txHash
      }
    }
  }
`
