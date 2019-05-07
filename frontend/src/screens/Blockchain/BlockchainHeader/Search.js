// @flow
import assert from 'assert'
import cn from 'classnames'
import idx from 'idx'
import React, {useState, useEffect, useCallback} from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import gql from 'graphql-tag'
import useReactRouter from 'use-react-router'
import {useQuery} from 'react-apollo-hooks'
import {defineMessages} from 'react-intl'
import {makeStyles} from '@material-ui/styles'
import {Typography} from '@material-ui/core'

import {useI18n} from '@/i18n/helpers'
import {Searchbar, LoadingError, Alert} from '@/components/visual'
import {routeTo} from '@/helpers/routes'
import analytics from '@/helpers/googleAnalytics'

const text = defineMessages({
  searchPlaceholder: 'Search addresses, transactions, epochs & slots on the Cardano network',
  noData: 'No items matching current query',
  helpText: 'Search for entity using its "hash" or use "epoch:number,slot:number" syntax',
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
              epoch
              slot
            }
            ... on Epoch {
              epochNumber
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
  const actionBuilder = {
    Address: {
      redirect: (searchResult) => routeTo.address(searchResult.address58),
      logToAnalytics: (searchResult) => analytics.trackSearchEvent('address'),
    },
    Transaction: {
      redirect: (searchResult) => routeTo.transaction(searchResult.txHash),
      logToAnalytics: (searchResult) => analytics.trackSearchEvent('transaction'),
    },
    Block: {
      redirect: (searchResult) =>
        searchResult.blockHash
          ? routeTo.block(searchResult.blockHash)
          : routeTo.slot(searchResult.epoch, searchResult.slot),
      // TODO: now we dont distinguish whether we search by blockHash or by epoch/slot
      logToAnalytics: () => analytics.trackSearchEvent('slot'),
    },
    Epoch: {
      redirect: (searchResult) => routeTo.epoch(searchResult.epochNumber),
      logToAnalytics: (searchResult) => analytics.trackSearchEvent('epoch'),
    },
  }[searchResult.__typename]

  assert(actionBuilder)
  actionBuilder.logToAnalytics(searchResult)
  return actionBuilder.redirect(searchResult)
}

const useStyles = makeStyles((theme) => ({
  wrapper: {
    position: 'relative',
  },
  gap: {
    marginTop: theme.spacing.unit * 1.5,
    position: 'absolute',
    width: '100%',
  },
  helpText: {
    marginLeft: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit * 2,
  },
  helpTextHidden: {
    visibility: 'hidden',
  },
  alertAppear: {
    opacity: 0,
  },
  alertAppearActive: {
    opacity: 1,
    transition: 'opacity 700ms',
  },
  alertLeave: {
    opacity: 1,
  },
  alertLeaveActive: {
    opacity: 0,
    transition: 'opacity 500ms',
  },
}))

const Search = () => {
  const {translate: tr} = useI18n()
  const {history} = useReactRouter()
  const classes = useStyles()

  // "submitted query"
  const [searchQuery, setSearchQuery] = useState('')
  const [searchText, setSearchText] = useState('')

  const skip = !searchQuery
  const {error, loading, searchResult} = useSearchData(searchQuery, skip)

  useEffect(() => {
    if (searchResult) {
      setSearchQuery('')
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

  const onAlertClose = useCallback(() => setSearchQuery(''), [setSearchQuery])

  const showAlert = searchQuery && !error && !loading && !searchResult

  return (
    <div className={classes.wrapper}>
      <Searchbar
        placeholder={tr(text.searchPlaceholder)}
        value={searchText}
        onChange={onChange}
        onSearch={setSearchQuery}
        loading={loading}
      />
      {!loading && error && <LoadingError error={error} />}
      <ReactCSSTransitionGroup
        transitionName={{
          leave: classes.alertLeave,
          leaveActive: classes.alertLeaveActive,
          enter: classes.alertAppear,
          enterActive: classes.alertAppearActive,
        }}
        transitionAppear={false}
        transitionEnterTimeout={700}
        transitionLeaveTimeout={500}
        transitionLeave
        transitionEnter
      >
        {showAlert && (
          <Alert
            type="noResults"
            className={classes.gap}
            message={tr(text.noData)}
            title=""
            onClose={onAlertClose}
          />
        )}
      </ReactCSSTransitionGroup>
      <Typography
        variant="caption"
        color="textSecondary"
        className={cn(classes.helpText, showAlert && classes.helpTextHidden)}
        align="center"
      >
        {tr(text.helpText)}
      </Typography>
    </div>
  )
}

export default Search
