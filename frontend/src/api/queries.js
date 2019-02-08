// @flow

import gql from 'graphql-tag'

export const GET_TRANSACTION_BY_ID = gql`
  query($txId: String!) {
    transaction(id: $txId) {
      id
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
  query($page: Int) {
    blocks(page: $page) {
      blocks {
        blockHash
      }
      cursor
      hasMore
    }
  }
`
