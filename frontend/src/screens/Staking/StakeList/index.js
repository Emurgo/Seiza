import React from 'react'
import gql from 'graphql-tag'
import classnames from 'classnames'
import {compose} from 'redux'
import {graphql} from 'react-apollo'
import {Grid, createStyles, withStyles} from '@material-ui/core'
import {withHandlers} from 'recompose'
import {defineMessages} from 'react-intl'

import {withI18n} from '@/i18n/helpers'
import {Button, DebugApolloError, LoadingInProgress, Alert} from '@/components/visual'
import StakePool from './StakePool'
import SearchAndFilterBar from './SearchAndFilterBar'
import SortByBar from './SortByBar'
import {withSortByContext, withSearchTextContext} from '../context'

const PAGE_SIZE = 3

const messages = defineMessages({
  loadMore: 'Load More',
  noResults: 'No matching results for the given query.',
})

const styles = (theme) =>
  createStyles({
    rowWrapper: {
      padding: '15px 30px',
      maxWidth: '1000px',
      width: '100%',
    },
    wrapper: {
      [theme.breakpoints.up('xl')]: {
        alignItems: 'center',
      },
    },
    loadMore: {
      marginTop: '30px',
      marginBottom: '50px',
      minWidth: '120px',
    },
    loadMoreWrapper: {
      width: '100%',
      maxWidth: '1000px',
    },
    sortByBar: {
      marginTop: '20px',
      marginBottom: '-15px',
    },
  })

const stakePoolFacade = (data) => ({
  hash: data.poolHash,
  name: data.name,
  description: data.description,
  createdAt: data.createdAt,
  fullness: data.summary.fullness,
  margins: data.summary.margins,
  performance: data.summary.performance,
  pledge: data.summary.pledge,
  stake: data.summary.adaStaked,
})

const StakeList = ({
  classes,
  poolsDataProvider: {loading, error, pagedStakePoolList},
  onLoadMore,
  i18n: {translate: tr},
}) => {
  if (loading) return <LoadingInProgress />
  if (error) return <DebugApolloError error={error} />
  const {hasMore, totalCount} = pagedStakePoolList
  const stakePoolList = pagedStakePoolList.stakePools.map(stakePoolFacade)
  return (
    <React.Fragment>
      <Grid container direction="column" alignItems="flex-start" className={classes.wrapper}>
        <Grid item className={classes.rowWrapper}>
          <SearchAndFilterBar />
        </Grid>
        {totalCount > 0 ? (
          <Grid item className={classnames(classes.rowWrapper, classes.sortByBar)}>
            <SortByBar totalPoolsCount={totalCount} shownPoolsCount={stakePoolList.length} />
          </Grid>
        ) : (
          <div className={classes.rowWrapper}>
            <Alert message={tr(messages.noResults)} />
          </div>
        )}
        {stakePoolList.map((pool) => (
          <Grid item key={pool.hash} className={classes.rowWrapper}>
            <StakePool data={pool} />
          </Grid>
        ))}
        {hasMore && (
          <Grid item className={classes.loadMoreWrapper}>
            <Grid container justify="center" direction="row">
              <Button className={classes.loadMore} gradient rounded onClick={onLoadMore}>
                {tr(messages.loadMore)}
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    </React.Fragment>
  )
}

export default compose(
  withI18n,
  withStyles(styles),
  withSortByContext,
  withSearchTextContext,
  graphql(
    gql`
      query($cursor: String, $pageSize: Int, $sortBy: StakePoolSortByEnum!, $searchText: String) {
        pagedStakePoolList(
          cursor: $cursor
          pageSize: $pageSize
          sortBy: $sortBy
          searchText: $searchText
        ) {
          stakePools {
            poolHash
            description
            name
            createdAt
            summary {
              adaStaked
              fullness
              margins
              performance
              adaStaked
              pledge
            }
          }
          cursor
          hasMore
          totalCount
        }
      }
    `,
    {
      name: 'poolsDataProvider',
      options: ({cursor, sortByContext: {sortBy}, searchTextContext: {searchText}}) => ({
        variables: {cursor, sortBy, searchText, pageSize: PAGE_SIZE},
      }),
    }
  ),
  withHandlers({
    onLoadMore: ({
      poolsDataProvider,
      sortByContext: {sortBy},
      searchTextContext: {searchText},
    }) => () => {
      const {
        fetchMore,
        pagedStakePoolList: {cursor},
      } = poolsDataProvider

      return fetchMore({
        variables: {cursor, pageSize: PAGE_SIZE, sortBy, searchText},
        updateQuery: (prev, {fetchMoreResult, ...rest}) => {
          if (!fetchMoreResult) return prev
          // TODO: currently taken from graphql docs, consider doing it nicer
          return {
            ...fetchMoreResult,
            pagedStakePoolList: {
              ...fetchMoreResult.pagedStakePoolList,
              stakePools: [
                ...prev.pagedStakePoolList.stakePools,
                ...fetchMoreResult.pagedStakePoolList.stakePools,
              ],
            },
          }
        },
      })
    },
  })
)(StakeList)
