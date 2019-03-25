// @flow

import * as React from 'react'
import gql from 'graphql-tag'
import {useQuery} from 'react-apollo-hooks'
import {defineMessages} from 'react-intl'
import {Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {useI18n} from '@/i18n/helpers'
import {useSelectedPoolsContext} from '../context/selectedPools'
import {LoadingInProgress, ComparisonMatrix, LoadingError} from '@/components/visual'

const messages = defineMessages({
  stakePools: 'Stake pools',
  noData: 'There are no pools selected.', // TODO: unify no data messages
})

const configMessages = defineMessages({
  totalPledge: 'Total pledge',
  numberOfStakers: 'Number of stakers',
  totalStakingFromStakers: 'Total Staking from Stakers',
  totalStaking: 'Total Staking',
  averageStakingPerStaker: 'Average Staking per Staker',
})

const useStyles = makeStyles((theme) => ({
  wrapper: {
    paddingBottom: theme.spacing.unit * 2,
  },
  loadingWrapper: {
    marginTop: 100,
  },
  error: {
    padding: theme.spacing.unit * 2,
  },
  noPools: {
    padding: theme.spacing.unit * 2,
  },
}))

// TODO: proper fields that make sense (now just taken from design)
const config = [
  {
    i18nLabel: configMessages.totalPledge,
    getValue: (stakePool, formatters) => 'N/A',
  },
  {
    i18nLabel: configMessages.numberOfStakers,
    getValue: (stakePool, formatters) => 'N/A',
  },
  {
    i18nLabel: configMessages.totalStakingFromStakers,
    getValue: (stakePool, formatters) => 'N/A',
  },
  {
    i18nLabel: configMessages.totalStaking,
    getValue: (stakePool, formatters) => 'N/A',
  },
  {
    i18nLabel: configMessages.averageStakingPerStaker,
    getValue: (stakePool, formatters) => 'N/A',
  },
]

const PoolDataFragment = gql`
  fragment ComparisonMatrixDataFragment on BootstrapEraStakePool {
    poolHash
    name
  }
`

const Stats = () => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  const {selectedPools: poolHashes} = useSelectedPoolsContext()

  // TODO: move data loading into local `index.js` and mock data on server

  const {error, loading, data} = useQuery(
    gql`
      query($poolHashes: [String!]!) {
        stakePools(poolHashes: $poolHashes) {
          ...ComparisonMatrixDataFragment
        }
      }
      ${PoolDataFragment}
    `,
    {
      variables: {poolHashes},
    }
  )

  if (loading && !data.stakePools) {
    // Note: this can hardly be cented right using FullWidth layout
    return (
      <div className={classes.loadingWrapper}>
        <LoadingInProgress />
      </div>
    )
  }

  // TODO: Move to local `index.js`
  if (error) {
    return (
      <div className={classes.error}>
        <LoadingError error={error} />
      </div>
    )
  }

  const stakePools = data.stakePools || []

  // TODO: Move to local `index.js`
  if (!loading && !stakePools.length) {
    return <Typography className={classes.noPools}>{tr(messages.noData)}</Typography>
  }

  return (
    <div className={classes.wrapper}>
      <ComparisonMatrix
        title={tr(messages.stakePools)}
        categoryConfigs={[{config}]}
        data={stakePools}
        getIdentifier={(data) => data.poolHash}
      />
    </div>
  )
}

export default Stats
