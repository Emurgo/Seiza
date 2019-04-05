// @flow
import assert from 'assert'
import idx from 'idx'
import React, {useState, useEffect, useCallback} from 'react'
import gql from 'graphql-tag'
import useReactRouter from 'use-react-router'
import {useQuery} from 'react-apollo-hooks'
import {defineMessages} from 'react-intl'
import {Typography} from '@material-ui/core'

import {useI18n} from '@/i18n/helpers'
import {Searchbar, LoadingError} from '@/components/visual'
import {routeTo} from '@/helpers/routes'

const text = defineMessages({
  searchPlaceholder: 'Search addresses, epochs & slots on the Cardano network',
  noData: 'No items matching current query',
})

const useSearchData = (searchQuery, skip) => {
  const {error, loading, data} = useQuery(
    gql`
      query($searchQuery: String!) {
        blockChainSearch(query: $searchQuery) {
          items {
            __typename
            ... on Transaction {
              txHash
            }
            ... on Address {
              address58
            }
            ... on Block {
              blockHash
            }
          }
        }
      }
    `,
    {
      variables: {searchQuery},
      skip,
    }
  )
  const matchedItems = idx(data, (_) => _.blockChainSearch.items) || []
  assert(matchedItems.length <= 1)
  return {error, loading, searchResult: matchedItems.length ? matchedItems[0] : null}
}

const getRedirectUrl = (searchResult) => {
  const redirectBuilder = {
    Address: (searchResult) => routeTo.address(searchResult.address58),
    Transaction: (searchResult) => routeTo.transaction(searchResult.txHash),
    Block: (searchResult) => routeTo.block(searchResult.blockHash),
  }[searchResult.__typename]

  assert(redirectBuilder)
  return redirectBuilder(searchResult)
}

const Search = () => {
  const {translate: tr} = useI18n()
  const {history} = useReactRouter()

  // "submitted query"
  const [searchQuery, setSearchQuery] = useState('')
  const [searchText, setSearchText] = useState('')

  const skip = !searchQuery
  const {error, loading, searchResult} = useSearchData(searchQuery, skip)

  useEffect(() => {
    if (searchResult) {
      setSearchQuery('')
      setSearchText('')
      history.push(getRedirectUrl(searchResult))
    }
  })

  const onChange = useCallback(
    (value) => {
      setSearchQuery('') // to cancel grapql search
      setSearchText(value)
    },
    [setSearchQuery, setSearchText]
  )

  return (
    <React.Fragment>
      <Searchbar
        placeholder={tr(text.searchPlaceholder)}
        value={searchText}
        onChange={onChange}
        onSearch={setSearchQuery}
        loading={loading}
      />
      {!loading && error && <LoadingError error={error} />}
      {!loading && !searchResult && searchQuery && (
        <Typography variant="body1">{tr(text.noData)}</Typography>
      )}
    </React.Fragment>
  )
}

export default Search
