// @flow

import * as React from 'react'
import gql from 'graphql-tag'
import {useQuery} from 'react-apollo-hooks'
import {defineMessages} from 'react-intl'
import {makeStyles} from '@material-ui/styles'

import {Typography} from '@material-ui/core'
import {useI18n} from '@/i18n/helpers'
import {useSelectedPoolsContext} from '../context/selectedPools'
import {LoadingInProgress, ComparisonMatrix, LoadingError, AdaValue} from '@/components/visual'
import {
  FadeoutFieldWithTooltip,
  EllipsizedLinkFieldWithTooltip,
} from '@/components/visual/ComparisonMatrix'

const messages = defineMessages({
  stakePools: 'Stake pools',
  categoryOneLabel: 'Category 1',
  categoryTwoLabel: 'Category 2',
  categoryThreeLabel: 'Category 3',
  noData: 'There are no pools selected.',
})

const categoryOneMessages = defineMessages({
  performance: 'Performance',
  declaredPledge: 'Declared Pledge',
  actualPledge: 'Actual Pledge',
  margins: 'Margins',
  createdAt: 'Creation time',
  lastUpdated: 'Last updated',
})

const categoryTwoMessages = defineMessages({
  fullness: 'Fullness',
  cost: 'Cost',
  ranking: 'Ranking',
  revenue: 'Revenue',
  website: 'Website',
  adaToSlot: 'ADA to Slot',
})

const categoryThreeMessages = defineMessages({
  region: 'Region',
  lifetimeReview: 'Lifetime Review',
  kPosition: 'K-position',
  description: 'Description',
})

// TODO: proper fields that make sense (now just taken from design)
const categoryOneConfig = [
  {
    i18nLabel: categoryOneMessages.performance,
    getValue: (stakePool, {formatPercent}) => formatPercent(stakePool.summary.performance),
  },
  {
    i18nLabel: categoryOneMessages.declaredPledge,
    getValue: (stakePool, formatters) => (
      <AdaValue value={stakePool.summary.ownerPledge.declared} />
    ),
  },
  {
    i18nLabel: categoryOneMessages.actualPledge,
    getValue: (stakePool, formatters) => <AdaValue value={stakePool.summary.ownerPledge.actual} />,
  },
  {
    i18nLabel: categoryOneMessages.margins,
    getValue: (stakePool, {formatPercent}) => formatPercent(stakePool.summary.margins),
  },
  {
    i18nLabel: categoryOneMessages.createdAt,
    getValue: (stakePool, {formatTimestamp}) => formatTimestamp(stakePool.createdAt),
  },
  {
    i18nLabel: categoryOneMessages.lastUpdated,
    getValue: (stakePool, formatters) => 'N/A',
  },
]

// TODO: proper fields that make sense (now just taken from design)
const categoryTwoConfig = [
  {
    i18nLabel: categoryTwoMessages.fullness,
    getValue: (stakePool, {formatPercent}) => formatPercent(stakePool.summary.fullness),
  },
  {
    i18nLabel: categoryTwoMessages.cost,
    getValue: (stakePool, formatters) => 'N/A',
  },
  {
    i18nLabel: categoryTwoMessages.ranking,
    getValue: (stakePool, formatters) => 'N/A',
  },
  {
    i18nLabel: categoryTwoMessages.revenue,
    getValue: (stakePool, {formatPercent}) => formatPercent(stakePool.summary.revenue),
  },
  {
    i18nLabel: categoryTwoMessages.website,
    render: (stakePool, formatters) => <EllipsizedLinkFieldWithTooltip text={stakePool.website} />,
  },
  {
    i18nLabel: categoryTwoMessages.adaToSlot,
    getValue: (stakePool, formatters) => 'N/A',
  },
]

// TODO: proper fields that make sense (now just taken from design)
const categoryThreeConfig = [
  {
    i18nLabel: categoryThreeMessages.region,
    getValue: (stakePool, formatters) => 'N/A',
  },
  {
    i18nLabel: categoryThreeMessages.lifetimeReview,
    getValue: (stakePool, formatters) => 'N/A',
  },
  {
    i18nLabel: categoryThreeMessages.kPosition,
    getValue: (stakePool, formatters) => 'N/A',
  },
  {
    i18nLabel: categoryThreeMessages.description,
    render: (stakePool, formatters) => {
      return <FadeoutFieldWithTooltip text={stakePool.description} height={132} />
    },
    height: 132, // used to sync height with label field
  },
]

const useStyles = makeStyles((theme) => ({
  noPools: {
    padding: theme.spacing.unit * 2,
  },
  loading: {
    marginTop: '100px',
  },
  error: {
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
  },
}))

const ComparisonMatrixScreen = () => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  const {selectedPools: poolHashes} = useSelectedPoolsContext()

  const {error, loading, data} = useQuery(
    gql`
      query($poolHashes: [String!]!) {
        stakePools(poolHashes: $poolHashes) {
          poolHash
          name
          createdAt
          description
          website
          summary {
            revenue
            performance
            adaStaked
            rewards
            keysDelegating
            fullness
            margins
            ownerPledge {
              actual
              declared
            }
          }
        }
      }
    `,
    {
      variables: {poolHashes},
    }
  )

  if (loading && !data.stakePools) {
    // Note: this can hardly be cented right using FullWidth layout
    return (
      <div className={classes.loading}>
        <LoadingInProgress />
      </div>
    )
  }

  if (error) {
    return (
      <div className={classes.error}>
        <LoadingError error={error} />
      </div>
    )
  }

  const stakePools = data.stakePools || []

  if (!loading && !stakePools.length) {
    return <Typography className={classes.noPools}>{tr(messages.noData)}</Typography>
  }

  return (
    <ComparisonMatrix
      title={tr(messages.stakePools)}
      categoryConfigs={[
        {categoryLabel: tr(messages.categoryOneLabel), config: categoryOneConfig},
        {categoryLabel: tr(messages.categoryTwoLabel), config: categoryTwoConfig},
        {categoryLabel: tr(messages.categoryThreeLabel), config: categoryThreeConfig},
      ]}
      data={stakePools}
      getIdentifier={(data) => data.poolHash}
    />
  )
}

export default ComparisonMatrixScreen
