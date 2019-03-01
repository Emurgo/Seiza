import React from 'react'
import gql from 'graphql-tag'
import {compose} from 'redux'
import {graphql} from 'react-apollo'
import {Grid, createStyles, withStyles} from '@material-ui/core'
import {withHandlers} from 'recompose'
import {defineMessages} from 'react-intl'

import {withI18n} from '@/i18n/helpers'
import {Button, DebugApolloError, LoadingInProgress} from '@/components/visual'
import StakePool from './StakePool'

const I18N_PREFIX = 'staking'
const PAGE_SIZE = 3

const messages = defineMessages({
  loadMore: {
    id: `${I18N_PREFIX}.loadMore`,
    defaultMessage: 'Load More',
  },
})

const styles = (theme) =>
  createStyles({
    rowWrapper: {
      padding: '15px 30px',
      maxWidth: '1000px',
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
  i18n: {translate},
}) => {
  if (loading) return <LoadingInProgress />
  if (error) return <DebugApolloError error={error} />
  const {hasMore} = pagedStakePoolList
  const _stakePoolList = pagedStakePoolList.stakePools.map(stakePoolFacade)
  return (
    <Grid container direction="column" alignItems="flex-start" className={classes.wrapper}>
      {_stakePoolList.map((pool) => (
        <Grid item key={pool.hash} className={classes.rowWrapper}>
          <StakePool data={pool} />
        </Grid>
      ))}
      {hasMore && (
        <Grid item>
          <Button className={classes.loadMore} gradient rounded onClick={onLoadMore}>
            {translate(messages.loadMore)}
          </Button>
        </Grid>
      )}
    </Grid>
  )
}

export default compose(
  withI18n,
  withStyles(styles),
  graphql(
    gql`
      query($cursor: String, $pageSize: Int) {
        pagedStakePoolList(cursor: $cursor, pageSize: $pageSize) {
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
        }
      }
    `,
    {
      name: 'poolsDataProvider',
      options: (props) => ({
        variables: {cursor: props.cursor, pageSize: PAGE_SIZE},
      }),
    }
  ),
  withHandlers({
    onLoadMore: ({poolsDataProvider}) => () => {
      const {
        fetchMore,
        pagedStakePoolList: {cursor},
      } = poolsDataProvider

      return fetchMore({
        variables: {cursor, pageSize: PAGE_SIZE},
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
