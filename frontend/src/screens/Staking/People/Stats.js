// @flow

import * as React from 'react'
import {defineMessages} from 'react-intl'
import {makeStyles} from '@material-ui/styles'

import {useI18n} from '@/i18n/helpers'
import {AdaValue, ComparisonMatrix} from '@/components/common'

const messages = defineMessages({
  stakePools: 'Stake pools',
})

const configMessages = defineMessages({
  declaredPledge: 'Declared pledge',
  actualPledge: 'Actual pledge',
  numberOfStakers: 'Number of stakers',
  totalStaking: 'Total Staking',
  totalStakingFromStakers: 'Total Staking from stakers',
  averageStakingPerStaker: 'Average Staking per Staker',
})

const useStyles = makeStyles((theme) => ({
  wrapper: {
    paddingBottom: theme.spacing(2),
  },
  loadingWrapper: {
    marginTop: 100,
  },
  error: {
    padding: theme.spacing(2),
  },
  noPools: {
    padding: theme.spacing(2),
  },
}))

const config = [
  {
    i18nLabel: configMessages.declaredPledge,
    getValue: (stakePool, formatters) => (
      <AdaValue value={stakePool.summary.ownerPledge.declared} />
    ),
  },
  {
    i18nLabel: configMessages.actualPledge,
    getValue: (stakePool, formatters) => <AdaValue value={stakePool.summary.ownerPledge.actual} />,
  },
  {
    i18nLabel: configMessages.totalStaking,
    getValue: (stakePool, formatters) => <AdaValue value={stakePool.summary.adaStaked} />,
  },
  {
    i18nLabel: configMessages.totalStakingFromStakers,
    getValue: (stakePool, formatters) => <AdaValue value={stakePool.summary.usersAdaStaked} />,
  },
  {
    i18nLabel: configMessages.numberOfStakers,
    getValue: (stakePool, formatters) => stakePool.summary.stakersCount,
  },
  {
    i18nLabel: configMessages.averageStakingPerStaker,
    getValue: (stakePool, formatters) => <AdaValue value={stakePool.summary.averageUserStaking} />,
  },
]

type StatsProps = {|
  data: Array<Object>, // TODO: get graphql type
|}

const Stats = ({data}: StatsProps) => {
  const classes = useStyles()
  const {translate: tr} = useI18n()

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
