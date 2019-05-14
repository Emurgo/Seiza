// @flow

import gql from 'graphql-tag'

export const BLOCK_INFO_FRAGMENT = gql`
  fragment BasicBlockInfo on Block {
    blockHash
    epoch
    slot
    timeIssued
    transactionsCount
    totalSent
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

export const GET_PAGED_BLOCKS_IN_EPOCH = gql`
  query($epochNumber: Int!, $cursor: Int) {
    pagedBlocksInEpoch(epochNumber: $epochNumber, cursor: $cursor) {
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
      totalAdaSent
      totalAdaReceived
    }
  }
`

export const GET_TXS_BY_ADDRESS = gql`
  query($address58: String!, $filterType: AddressTxsFilter!, $cursor: Int) {
    address(address58: $address58) {
      transactions(type: $filterType, cursor: $cursor) {
        totalCount
        transactions {
          txHash
          fees
          block {
            blockHash
            epoch
            slot
            timeIssued
          }
          totalInput
          totalOutput
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
    }
  }
`
