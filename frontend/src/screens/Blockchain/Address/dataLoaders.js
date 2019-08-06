// @flow
import idx from 'idx'
import gql from 'graphql-tag'
import {extractError} from '@/helpers/errors'
import {APOLLO_CACHE_OPTIONS} from '@/constants'
import {useQueryNotBugged} from '@/components/hooks/useQueryNotBugged'
import {FILTER_TYPES} from './constants'

export const GET_ADDRESS_BY_ADDRESS58 = gql`
  query($address58: String!) {
    address(address58: $address58) {
      address58
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

export const useLoadAddressSummary = (address58: string) => {
  const {loading, data, error} = useQueryNotBugged(GET_ADDRESS_BY_ADDRESS58, {
    variables: {address58},
    fetchPolicy: APOLLO_CACHE_OPTIONS.CACHE_AND_NETWORK,
  })

  // TODO: how to extract error properly???
  return {loading, error: extractError(error, ['address']) || error, addressSummary: data.address}
}

export const useLoadAddressTransactions = (
  address58: string,
  filterType: $Values<FILTER_TYPES>,
  cursor: ?number
) => {
  const {loading, data, error} = useQueryNotBugged(GET_TXS_BY_ADDRESS, {
    variables: {address58, filterType, cursor},
    fetchPolicy: APOLLO_CACHE_OPTIONS.CACHE_AND_NETWORK,
  })

  // TODO: how to extract error properly???
  return {
    loading,
    error: extractError(error, ['address']) || error,
    transactions: idx(data, (_) => _.address.transactions),
  }
}
