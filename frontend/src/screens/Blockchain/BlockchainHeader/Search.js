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
import {Typography, Portal} from '@material-ui/core'

import {useI18n} from '@/i18n/helpers'
import {Searchbar, Alert} from '@/components/visual'
import {LoadingError} from '@/components/common'
import {useSearchbarRef} from '@/components/context/searchbarRef'

import {routeTo} from '@/helpers/routes'
import * as urlHelpers from '@/helpers/url'
import {useAnalytics} from '@/components/context/googleAnalytics'
import {APOLLO_CACHE_OPTIONS} from '@/constants'
import {getDefaultSpacing} from '@/components/visual/ContentSpacing'

const text = defineMessages({
  searchPlaceholder: 'Search addresses, transactions, epochs & slots on the Cardano network',
  noData: 'No items matching current query',
  helpText: 'Search for entity using its "hash" or use "epoch:number slot:number" syntax',
})

const useSearchData = (searchQuery, skip) => {
  const {error, loading, data, refetch} = useQuery(
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
      fetchPolicy: APOLLO_CACHE_OPTIONS.NO_CACHE,
      skip,
      // So that we get `loading` after `refetch` is called
      notifyOnNetworkStatusChange: true,
    }
  )

  const matchedItems = idx(data, (_) => _.blockChainSearch.items) || []
  assert(matchedItems.length <= 1)
  return {error, loading, refetch, searchResult: matchedItems.length ? matchedItems[0] : null}
}

const getRedirectUrl = (analytics, searchResult) => {
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
  alert: {
    marginTop: theme.spacing(1.5),
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    padding: getDefaultSpacing(theme) * 0.5,
    paddingTop: getDefaultSpacing(theme) * 0.25,
    paddingBottom: getDefaultSpacing(theme) * 0.25,
  },
  helpText: {
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    marginTop: theme.spacing(2),
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

type SearchHelpTextProps = {|
  className?: string,
|}

export const SearchHelpText = ({className}: SearchHelpTextProps) => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  return (
    <Typography
      variant="caption"
      color="textSecondary"
      className={cn(classes.helpText, className)}
      align="center"
      component="div"
    >
      {tr(text.helpText)}
    </Typography>
  )
}

type SearchProps = {|
  isMobile?: boolean,
|}

const useTextfieldFocus = (defaultValue: boolean) => {
  const [isFocused, setIsFocused] = useState(defaultValue)
  const onFocus = useCallback(() => setIsFocused(true), [setIsFocused])
  const onBlur = useCallback(() => setIsFocused(false), [setIsFocused])
  return {isFocused, onFocus, onBlur}
}

const Search = ({isMobile = false}: SearchProps) => {
  const {translate: tr} = useI18n()
  const {location, history} = useReactRouter()
  const classes = useStyles()
  const analytics = useAnalytics()

  // "submitted query"
  const [searchQuery, setSearchQuery] = useState('')
  const [searchText, setSearchText] = useState('')

  const skip = !searchQuery
  const {error, loading, refetch, searchResult} = useSearchData(searchQuery, skip)

  useEffect(() => {
    if (searchResult) {
      setSearchQuery('')
      const redirectTo = getRedirectUrl(analytics, searchResult)
      const action = redirectTo !== location.pathname ? history.push : history.replace
      action({
        pathname: routeTo.searchResults(),
        search: urlHelpers.stringify({redirectTo}),
      })
    }
  }, [searchResult, history, analytics, location.pathname])

  const onChange = useCallback(
    (value) => {
      setSearchQuery('') // to cancel grapql search
      setSearchText(value)
    },
    [setSearchQuery, setSearchText]
  )

  const onSearch = useCallback(
    (value) => {
      const trimmed = value.trim()
      setSearchQuery(trimmed)
      setSearchText(trimmed)

      // We want to re-run search even for same query when user submits again
      // useQuery ignores that case even with fetchPolicy: no-cache,
      // probably because of possible infinite-rerender loop
      trimmed === searchQuery && refetch()
    },
    [setSearchQuery, setSearchText, searchQuery, refetch]
  )

  const onAlertClose = useCallback(() => setSearchQuery(''), [setSearchQuery])

  const showAlert = searchQuery && !error && !loading && !searchResult

  const searchbarRef = useSearchbarRef()

  const {isFocused: isSearchbarFocused, onFocus, onBlur} = useTextfieldFocus(false)

  return (
    <div className={classes.wrapper}>
      <Searchbar
        inputProps={{onFocus, onBlur}}
        placeholder={tr(text.searchPlaceholder)}
        value={searchText}
        onChange={onChange}
        onSearch={onSearch}
        loading={loading}
      />
      {!loading && error && (
        <div className={classes.alert}>
          <LoadingError error={error} />
        </div>
      )}
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
            className={classes.alert}
            message={tr(text.noData)}
            title=""
            onClose={onAlertClose}
          />
        )}
      </ReactCSSTransitionGroup>
      {isMobile ? (
        <Portal container={searchbarRef.current}>
          <SearchHelpText
            className={!isSearchbarFocused || showAlert ? classes.helpTextHidden : ''}
          />
        </Portal>
      ) : (
        <SearchHelpText className={showAlert ? classes.helpTextHidden : ''} />
      )}
    </div>
  )
}

export default Search
