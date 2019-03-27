// @flow

import * as React from 'react'
import {defineMessages} from 'react-intl'
import {makeStyles} from '@material-ui/styles'

import {useI18n} from '@/i18n/helpers'
import {ComparisonMatrix, AdaValue} from '@/components/visual'

const messages = defineMessages({
  stakePools: 'Stake pools',
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

const config = [
  {
    i18nLabel: configMessages.totalPledge,
    getValue: (stakePool, formatters) => <AdaValue value={stakePool.summary.pledge} />,
  },
  {
    i18nLabel: configMessages.numberOfStakers,
    getValue: (stakePool, formatters) => stakePool.summary.stakersCount,
  },
  {
    i18nLabel: configMessages.totalStakingFromStakers,
    getValue: (stakePool, formatters) => <AdaValue value={stakePool.summary.adaStaked} />,
  },
  {
    i18nLabel: configMessages.totalStaking,
    getValue: (stakePool, formatters) => {
      const totalStaking = `${parseInt(stakePool.summary.adaStaked, 10) +
        parseInt(stakePool.summary.pledge, 10)}`
      return <AdaValue value={totalStaking} />
    },
  },
  {
    i18nLabel: configMessages.averageStakingPerStaker,
    getValue: (stakePool, formatters) => {
      const averagePerStaker = `${parseInt(stakePool.summary.adaStaked, 10) /
        parseInt(stakePool.summary.stakersCount, 10)}`
      return <AdaValue value={averagePerStaker} />
    },
  },
]

type StatsProps = {|
  data: Array<Object>, // TODO: get graphql type
  NoDataComponent: Function,
  loading: boolean,
|}

const Stats = ({data, NoDataComponent, loading}: StatsProps) => {
  const classes = useStyles()
  const {translate: tr} = useI18n()

  if (!loading && !data.length) return <NoDataComponent />

  return (
    <div className={classes.wrapper}>
      <ComparisonMatrix
        title={tr(messages.stakePools)}
        categoryConfigs={[{config}]}
        data={data}
        getIdentifier={(data) => data.poolHash}
      />
    </div>
  )
}

export default Stats
