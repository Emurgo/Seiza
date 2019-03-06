import React from 'react'
import {compose} from 'redux'
import {defineMessages} from 'react-intl'
import {withRouter} from 'react-router'
import {withProps} from 'recompose'
import {EntityIdCard, SimpleLayout} from '@/components/visual'
import {withI18n} from '@/i18n/helpers'
import AdaIcon from '@/assets/icons/transaction-id.svg'

import StakePoolStakingKey from './StakePoolStakingKey'
import UserStakingKey from './UserStakingKey'

const I18N_PREFIX = 'blockchain.stakingKey'

const messages = defineMessages({
  header: {
    id: `${I18N_PREFIX}.header`,
    defaultMessage: 'Staking Key',
  },
  stakingKey: {
    id: `${I18N_PREFIX}.entityId`,
    defaultMessage: 'Staking Key Id',
  },
})

const SCREEN_CONTENT = {
  USER: (props) => <UserStakingKey {...props} />,
  STAKING_POOL: (props) => <StakePoolStakingKey {...props} />,
}

// TODO: get data from backend
const stakingKey = {
  type: 'USER',
  createdAt: '2019-02-13T10:58:31.000Z',
  stakedAda: '151251251981295151',
  totalRewards: '41513514846517',
  uncollectedRewards: '9439918145817',
  addressesCount: 5134,
  totalEpochsActive: 11,
  rewardAddress: 'a5c3af824de94faff971d1b2488c5017dcf0f3c3a056334195efb368c0fe2f75',
  delegationCert: '6b686ed997b3846ebf93642b5bfe482ca2682245b826601ca352d2c3c0394a68',
}

const StakingKey = ({stakingKeyHash, i18n: {translate}}) => {
  const ScreenContent = SCREEN_CONTENT[stakingKey.type]

  return (
    <SimpleLayout title={translate(messages.header)}>
      <EntityIdCard
        label={translate(messages.stakingKey)}
        value={stakingKeyHash}
        iconRenderer={<img alt="" src={AdaIcon} width={40} height={40} />}
      />
      <ScreenContent stakingKey={stakingKey} />
    </SimpleLayout>
  )
}

export default compose(
  withRouter,
  withProps((props) => ({
    stakingKeyHash: props.match.params.stakingKey,
  })),
  withI18n
)(StakingKey)
