import React from 'react'
import {defineMessages} from 'react-intl'
import {withI18n} from '@/i18n/helpers'
import Table from '@/components/visual/Table'

const I18N_PREFIX = 'blockchain.epoch.stakingPoolsTab'

const messages = defineMessages({
  name: {
    id: `${I18N_PREFIX}.nameColumn`,
    defaultMessage: 'Name',
  },
  performance: {
    id: `${I18N_PREFIX}.performanceColumn`,
    defaultMessage: 'Performance',
  },
  adaStaked: {
    id: `${I18N_PREFIX}.adaStakedColumn`,
    defaultMessage: 'ADA Staked',
  },
  rewards: {
    id: `${I18N_PREFIX}.rewardsColumn`,
    defaultMessage: 'Rewards Received',
  },
  keysDelegating: {
    id: `${I18N_PREFIX}.keysDelegating`,
    defaultMessage: 'Keys Delegating',
  },
})

const StakingPools = ({i18n}) => {
  const {translate} = i18n

  const headerData = [
    translate(messages.name),
    translate(messages.performance),
    translate(messages.adaStaked),
    translate(messages.rewards),
    translate(messages.keysDelegating),
  ]

  const bodyData = [['TODO', 'TODO', 'TODO', 'TODO', 'TODO']]
  return <Table bodyData={bodyData} headerData={headerData} />
}

export default withI18n(StakingPools)
