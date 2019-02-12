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

export const GET_BLOCKS = gql`
  query($cursor: Int) {
    blocks(cursor: $cursor) {
      blocks {
        blockHash
      }
      cursor
      hasMore
    }
  }
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
