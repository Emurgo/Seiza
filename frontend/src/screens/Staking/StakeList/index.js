import React from 'react'
import gql from 'graphql-tag'
import {compose} from 'redux'
import {graphql} from 'react-apollo'
import {Grid, createStyles, withStyles} from '@material-ui/core'

import {DebugApolloError, LoadingInProgress} from '@/components/visual'
import StakePool from './StakePool'

const styles = () =>
  createStyles({
    rowWrapper: {
      padding: '15px 30px',
      width: '1000px',
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

const StakeList = ({classes, poolsDataProvider: {loading, error, stakePoolList}}) => {
  if (loading) return <LoadingInProgress />
  if (error) return <DebugApolloError error={error} />
  const _stakePoolList = stakePoolList.map(stakePoolFacade)
  return (
    <Grid container direction="column" alignItems="center">
      {_stakePoolList.map((pool) => (
        <Grid item key={pool.hash} className={classes.rowWrapper}>
          <StakePool data={pool} />
        </Grid>
      ))}
    </Grid>
  )
}

export default compose(
  withStyles(styles),
  graphql(
    gql`
      {
        stakePoolList {
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
      }
    `,
    {
      name: 'poolsDataProvider',
    }
  )
)(StakeList)
