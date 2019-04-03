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
  return {error, loading, match: matchedItems.length ? matchedItems[0] : null}
}

const getRedirectUrl = (match) => {
  let redirectUrl = ''
  switch (match.__typename) {
    case 'Address':
      redirectUrl = routeTo.address(match.address58)
      break
    case 'Transaction':
      redirectUrl = routeTo.transaction(match.txHash)
      break
    case 'Block':
      redirectUrl = routeTo.block(match.blockHash)
      break
    default:
  }

  assert(redirectUrl !== '')
  return redirectUrl
}

const Search = () => {
  const {translate: tr} = useI18n()
  const {history} = useReactRouter()

  // "submitted query"
  const [query, setQuery] = useState('')
  const [searchText, setSearchText] = useState('')

  const skip = !query
  const {error, loading, match} = useSearchData(query, skip)

  useEffect(() => {
    if (match) {
      setQuery('')
      setSearchText('')
      history.push(getRedirectUrl(match))
    }
  })

  const onChange = useCallback(
    (value) => {
      setQuery('')
      setSearchText(value)
    },
    [setQuery, setSearchText]
  )

  return (
    <React.Fragment>
      <Searchbar
        placeholder={tr(text.searchPlaceholder)}
        value={searchText}
        onChange={onChange}
        onSearch={setQuery}
        loading={loading}
      />
      {!loading && error && <LoadingError error={error} />}
      {!loading && !match && query && <Typography variant="body1">{tr(text.noData)}</Typography>}
    </React.Fragment>
  )
}

export default Search
