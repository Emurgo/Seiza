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
      totalCount
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
      totalCount
    }
  }
  ${BLOCK_INFO_FRAGMENT}
`
