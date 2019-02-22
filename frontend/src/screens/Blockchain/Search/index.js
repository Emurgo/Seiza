// @flow

import React from 'react'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {withProps} from 'recompose'
import {withRouter} from 'react-router'
import {defineMessages} from 'react-intl'
import {Typography, Link as MuiLink} from '@material-ui/core'

import {withI18n} from '@/i18n/helpers'

import gql from 'graphql-tag'
import {Link as RouterLink} from 'react-router-dom'

import {routeTo} from '@/helpers/routes'

import {SimpleLayout, LoadingInProgress, DebugApolloError} from '@/components/visual'

const messages = defineMessages({
  title: {
    id: 'blockchain.search.title',
    defaultMessage: 'Search results',
  },
  query: {
    id: 'blockchain.search.query',
    defaultMessage: 'Query: ',
  },
  noResults: {
    id: 'blockchain.search.noResults',
    defaultMessage: 'Nothing found!',
  },
  address: {
    id: 'blockchain.search.address',
    defaultMessage: 'Address: ',
  },
  transaction: {
    id: 'blockchain.search.transaction',
    defaultMessage: 'Transaction: ',
  },
  block: {
    id: 'blockchain.search.block',
    defaultMessage: 'Block: ',
  },
})

const Link = ({to, children}) => (
  <MuiLink component={RouterLink} to={to}>
    {children}
  </MuiLink>
)

const Address = ({item, i18n}) => (
  <div>
    <Typography variant="title">{i18n.translate(messages.address)}</Typography>
    <Link to={routeTo.address(item.address58)}>{item.address58}</Link>
  </div>
)

const Transaction = ({item, i18n}) => (
  <div>
    <Typography variant="title">{i18n.translate(messages.transaction)}</Typography>
    <Link to={routeTo.transaction(item.txHash)}>{item.txHash}</Link>
  </div>
)

const Block = ({item, i18n}) => (
  <div>
    <Typography variant="title">{i18n.translate(messages.block)}</Typography>
    <Link to={routeTo.block(item.blockHash)}>{item.blockHash}</Link>
  </div>
)

const getRenderer = (item) => {
  const renderers = {
    Address,
    Transaction,
    Block,
  }

  return renderers[item.__typename]
}

const SearchResults = ({items, i18n}) => {
  if (!items.length) return <div>{i18n.translate(messages.noResults)}</div>

  return (
    <div>
      {items.map((item, i) => {
        const Item = getRenderer(item)
        return <Item key={i} item={item} i18n={i18n} />
      })}
    </div>
  )
}

const SearchScreen = ({searchDataProvider, query, i18n}) => {
  const {loading, error, blockChainSearch} = searchDataProvider

  return (
    <SimpleLayout title={i18n.translate(messages.title)}>
      <div>
        <Typography variant="body1">Query: {query}</Typography>
      </div>
      {loading ? (
        <LoadingInProgress />
      ) : error ? (
        <DebugApolloError error={error} />
      ) : (
        <SearchResults items={blockChainSearch.items} i18n={i18n} />
      )}
    </SimpleLayout>
  )
}

const SEARCH_QUERY = gql`
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
`

export default compose(
  withRouter,
  withProps((props) => ({
    query: props.match.params.query,
  })),
  graphql(SEARCH_QUERY, {
    name: 'searchDataProvider',
    options: ({query}: any) => ({
      variables: {query},
    }),
  }),
  withI18n
)(SearchScreen)
