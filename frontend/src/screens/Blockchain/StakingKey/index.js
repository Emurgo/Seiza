import React from 'react'
import {compose} from 'redux'
import {defineMessages} from 'react-intl'
import {withRouter} from 'react-router'
import {withProps} from 'recompose'

import {SimpleLayout, EntityIdCard, Alert} from '@/components/visual'
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
  poolRetiredWarning: {
    id: `${I18N_PREFIX}.poolRetiredWarning`,
    defaultMessage: 'Stake Pool is retired',
  },
  poolSaturatedWarning: {
    id: `${I18N_PREFIX}.poolSaturatedWarning`,
    defaultMessage: 'Stake Pool is overly saturated',
  },
  poolNotCompetitive: {
    id: `${I18N_PREFIX}.poolNotCompetitive`,
    defaultMessage: 'Stake pool is not in the top 100',
  },
})

const SCREEN_CONTENT = {
  USER: (props) => <UserStakingKey {...props} />,
  STAKING_POOL: (props) => <StakePoolStakingKey {...props} />,
}

const StakingKey = ({stakingKeyHash, location, i18n: {translate}}) => {
  // TODO: get data from backend
  const stakingKeyUser = {
    stakingKeyHash,
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

  // TODO: get data from backend
  const stakingKeyPool = {
    stakingKeyHash,
    name: 'Warren Buffett and Friend’s Stake Pool',
    validationCharacters: 'c0fe2f75',
    createdAt: '2019-02-13T10:58:31.000Z',
    webpage: 'https://www.warrenbuffettstakepool.com',
    pledge: '10000003723742',
    totalAdaStaked: '10000003723742',
    performance: 0.65,
    totalRewards: '5000000123123',
    totalActiveEpochs: 32,
    stakersCount: 1271,
    currentMargin: {
      margin: 0.08,
      updatedAt: '2019-02-13T10:58:31.000Z',
    },
    currentCost: {
      cost: '500000000',
      updatedAt: '2019-02-13T10:58:31.000Z',
    },
    topPoolComparison: {
      margin: 0.03,
      cost: '-100000000',
      fullness: -0.1,
      revenue: -0.05,
    },
    fullness: 0.8,
    revenue: 0.85,
    description: 'let’s work together to make money!',
    rewardsAddress: 'a5c3af824de94faff971d1b2488c5017dcf0f3c3a056334195efb368c0fe2f75',
    stakePoolCertificate: '6b686ed997b3846ebf93642b5bfe482ca2682245b826601ca352d2c3c0394a68',
  }

  // TODO: TEMPORARY to be able to see pool staking key type as well as user staking key type
  const isStakingPoolType = location.search === '?pool'
  const ScreenContent = isStakingPoolType ? SCREEN_CONTENT.STAKING_POOL : SCREEN_CONTENT.USER
  const stakingKey = isStakingPoolType ? stakingKeyPool : stakingKeyUser

  return (
    <SimpleLayout title={translate(messages.header)}>
      {isStakingPoolType && <Alert warning message={translate(messages.poolRetiredWarning)} />}
      <EntityIdCard
        label={translate(messages.stakingKey)}
        value={stakingKey.stakingKeyHash}
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
