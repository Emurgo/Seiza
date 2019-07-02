import React from 'react'
import gql from 'graphql-tag'
import classnames from 'classnames'
import {compose} from 'redux'
import {graphql} from 'react-apollo'
import {Typography, Grid, createStyles} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {withHandlers, withProps} from 'recompose'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {Button, Overlay, LoadingInProgress} from '@/components/visual'
import {LoadingError, LoadingOverlay} from '@/components/common'
import StakePool from './StakePool'
import SearchAndFilterBar from './SearchAndFilterBar'
import SortByBar from './SortByBar'
import {usePerformanceContext} from '../context/performance'
import {useSearchTextContext} from '../context/searchText'
import {useSortByContext} from '../context/sortBy'

const PAGE_SIZE = 3

const messages = defineMessages({
  loadMore: 'Load More',
  noResults: 'No matching results for the given query.',
})

const useStyles = makeStyles((theme) =>
  createStyles({
    rowWrapper: {
      padding: '15px 30px',
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
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    loadMoreWrapper: {
      width: '100%',
    },
    sortByBar: {
      marginTop: '20px',
      marginBottom: '-15px',
    },
    lastItemSpace: {
      padding: theme.spacing(5),
    },
  })
)

const stakePoolFacade = (data) => ({
  hash: data.poolHash,
  name: data.name,
  description: data.description,
  createdAt: data.createdAt,
  fullness: data.summary.fullness,
  margins: data.summary.margins,
  performance: data.summary.performance,
  // TODO: distinguish between `declared` and `actual` pledge?
  pledge: data.summary.ownerPledge.declared,
  stake: data.summary.adaStaked,
})

const StakeList = ({onLoadMore, pagedStakePoolList, loading}) => {
  const {translate: tr} = useI18n()
  const classes = useStyles()

  if (loading && !pagedStakePoolList) return <LoadingInProgress />

  const {hasMore} = pagedStakePoolList
  const stakePoolList = pagedStakePoolList.stakePools.map(stakePoolFacade)

  return (
    <Overlay.Wrapper className="w-100">
      {stakePoolList.map((pool) => (
        <Grid item key={pool.hash} className={classes.rowWrapper}>
          <StakePool data={pool} />
        </Grid>
      ))}
      {hasMore ? (
        <Grid item className={classes.loadMoreWrapper}>
          <Grid container justify="center" direction="row">
            <Button className={classes.loadMore} primaryGradient rounded onClick={onLoadMore}>
              {tr(messages.loadMore)}
            </Button>
          </Grid>
        </Grid>
      ) : (
        <div className={classes.lastItemSpace} />
      )}
      <LoadingOverlay loading={loading} />
    </Overlay.Wrapper>
  )
}

const StakeListWrapper = ({
  poolsDataProvider: {loading, error, pagedStakePoolList},
  onLoadMore,
}) => {
  const {translate: tr} = useI18n()
  const classes = useStyles()

  const totalCount = loading || error ? 0 : pagedStakePoolList.totalCount
  const shownPoolsCount = loading || error ? 0 : pagedStakePoolList.stakePools.length

  return (
    <React.Fragment>
      <Grid container direction="column" alignItems="flex-start" className={classes.wrapper}>
        <Grid item className={classes.rowWrapper}>
          <SearchAndFilterBar />
        </Grid>
        {loading || error || totalCount > 0 ? (
          <Grid item className={classnames(classes.rowWrapper, classes.sortByBar)}>
            <SortByBar
              loading={loading}
              error={error}
              totalPoolsCount={totalCount}
              shownPoolsCount={shownPoolsCount}
            />
          </Grid>
        ) : (
          <div className={classes.rowWrapper}>
            <Typography>{tr(messages.noResults)}</Typography>
          </div>
        )}
        {error ? (
          <Grid item className={classes.rowWrapper}>
            <LoadingError error={error} />
          </Grid>
        ) : (
          <StakeList
            loading={loading}
            pagedStakePoolList={pagedStakePoolList}
            onLoadMore={onLoadMore}
          />
        )}
      </Grid>
    </React.Fragment>
  )
}

const formatPerformancetoGQL = (performance) => ({
  from: performance[0] / 100,
  to: performance[1] / 100,
})

// TODO: refactor with hooks
export default compose(
  withProps(() => {
    const sortByContext = useSortByContext()
    const performanceContext = usePerformanceContext()
    const searchTextContext = useSearchTextContext()
    return {sortByContext, performanceContext, searchTextContext}
  }),
  graphql(
    gql`
      query($cursor: String, $pageSize: Int, $searchOptions: StakePoolSearchOptions!) {
        pagedStakePoolList(cursor: $cursor, pageSize: $pageSize, searchOptions: $searchOptions) {
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
              ownerPledge {
                declared
              }
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
      options: ({
        sortByContext: {sortBy},
        cursor,
        searchTextContext: {searchText},
        performanceContext: {performance},
      }) => ({
        variables: {
          cursor,
          pageSize: PAGE_SIZE,
          searchOptions: {
            sortBy,
            searchText,
            performance: formatPerformancetoGQL(performance),
          },
        },
      }),
    }
  ),
  withHandlers({
    onLoadMore: ({
      poolsDataProvider,
      searchTextContext: {searchText},
      performanceContext: {performance},
      sortByContext: {sortBy},
    }) => () => {
      const {
        fetchMore,
        pagedStakePoolList: {cursor},
      } = poolsDataProvider

      return fetchMore({
        variables: {
          cursor,
          pageSize: PAGE_SIZE,
          searchOptions: {
            sortBy,
            searchText,
            performance: formatPerformancetoGQL(performance),
          },
        },
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
)(StakeListWrapper)
