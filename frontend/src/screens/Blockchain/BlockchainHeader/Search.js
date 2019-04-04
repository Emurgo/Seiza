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

const useSearchData = (query, skip) => {
  const {error, loading, data} = useQuery(
    gql`
      query($query: String!) {
        blockChainSearch(query: $query) {
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
      variables: {query},
      skip,
    }
  )
  const matchedItems = idx(data, (_) => _.blockChainSearch.items) || []
  assert(matchedItems.length <= 1)
  return {error, loading, searchMatch: matchedItems.length ? matchedItems[0] : null}
}

const getRedirectUrl = (searchMatch) => {
  const redirectBuilder = {
    Address: (searchMatch) => routeTo.address(searchMatch.address58),
    Transaction: (searchMatch) => routeTo.transaction(searchMatch.txHash),
    Block: (searchMatch) => routeTo.block(searchMatch.blockHash),
  }[searchMatch.__typename]

  assert(redirectBuilder)
  return redirectBuilder(searchMatch)
}

const Search = () => {
  const {translate: tr} = useI18n()
  const {history} = useReactRouter()

  // "submitted query"
  const [searchQuery, setSearchQuery] = useState('')
  const [searchText, setSearchText] = useState('')

  const skip = !searchQuery
  const {error, loading, searchMatch} = useSearchData(searchQuery, skip)

  useEffect(() => {
    if (searchMatch) {
      setSearchQuery('')
      setSearchText('')
      history.push(getRedirectUrl(searchMatch))
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
      {!loading && !searchMatch && searchQuery && (
        <Typography variant="body1">{tr(text.noData)}</Typography>
      )}
    </React.Fragment>
  )
}

export default Search
