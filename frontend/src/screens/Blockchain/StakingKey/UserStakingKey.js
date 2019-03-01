import React from 'react'
import {compose} from 'redux'

import {defineMessages} from 'react-intl'

import {withI18n} from '@/i18n/helpers'
import {AdaValue, SummaryCard} from '@/components/visual'

const I18N_PREFIX = 'blockchain.stakingKey.user'

const messages = defineMessages({
  stakingType: {
    id: `${I18N_PREFIX}.stakingType`,
    defaultMessage: 'Staking Type:',
  },
  stakingTypeUser: {
    id: `${I18N_PREFIX}.stakingTypeUser`,
    defaultMessage: 'User',
  },
  stakingTypeStakingPool: {
    id: `${I18N_PREFIX}.stakingTypeStakingPool`,
    defaultMessage: 'Staking Pool',
  },
  stakingTypePending: {
    id: `${I18N_PREFIX}.stakingTypePending`,
    defaultMessage: 'Pending',
  },
  creationDate: {
    id: `${I18N_PREFIX}.creationDate`,
    defaultMessage: 'Creation Date:',
  },
  stakedAda: {
    id: `${I18N_PREFIX}.stakedAda`,
    defaultMessage: 'Staked ADA:',
  },
  addressesCount: {
    id: `${I18N_PREFIX}.addressesCount`,
    defaultMessage: '# Addresses:',
  },
  addresses: {
    id: `${I18N_PREFIX}.addresses`,
    defaultMessage: '{count, plural, =0 {addresses} one {address} other {addresses}}',
  },
  totalRewards: {
    id: `${I18N_PREFIX}.totalRewards`,
    defaultMessage: 'Total Rewards:',
  },
  uncollectedRewards: {
    id: `${I18N_PREFIX}.uncollectedRewards`,
    defaultMessage: 'Uncollected Rewards:',
  },
  rewardAddress: {
    id: `${I18N_PREFIX}.rewardAddress`,
    defaultMessage: 'Reward Address:',
  },
  delegationCert: {
    id: `${I18N_PREFIX}.delegationCertificate`,
    defaultMessage: 'Delegation Certificate:',
  },
})

const UserStakingKey = ({stakingKey, i18n: {translate, formatTimestamp, formatInt}}) => {
  const {Row, Label, Value} = SummaryCard

  return (
    <React.Fragment>
      <SummaryCard>
        <Row>
          <Label>{translate(messages.stakingType)}</Label>
          <Value>{translate(messages.stakingTypeUser)}</Value>
        </Row>
        <Row>
          <Label>{translate(messages.creationDate)}</Label>
          <Value>{formatTimestamp(stakingKey.createdAt)}</Value>
        </Row>
        <Row>
          <Label>{translate(messages.stakedAda)}</Label>
          <Value>
            <AdaValue showCurrency value={stakingKey.stakedAda} />
          </Value>
        </Row>
        <Row>
          <Label>{translate(messages.addressesCount)}</Label>
          <Value>
            {formatInt(stakingKey.addressesCount)}{' '}
            {translate(messages.addresses, {count: stakingKey.addressesCount})}
          </Value>
        </Row>
        <Row>
          <Label>{translate(messages.totalRewards)}</Label>
          <Value>
            <AdaValue showCurrency value={stakingKey.totalRewards} />
          </Value>
        </Row>
        <Row>
          <Label>{translate(messages.uncollectedRewards)}</Label>
          <Value>
            <AdaValue showCurrency value={stakingKey.uncollectedRewards} />
          </Value>
        </Row>
        <Row>
          <Label>{translate(messages.uncollectedRewards)}</Label>
          <Value>
            <AdaValue showCurrency value={stakingKey.uncollectedRewards} />
          </Value>
        </Row>
      </SummaryCard>
      <SummaryCard>
        <Row>
          <Label>{translate(messages.rewardAddress)}</Label>
          <Value>{stakingKey.rewardAddress}</Value>
        </Row>
      </SummaryCard>
      <SummaryCard>
        <Row>
          <Label>{translate(messages.delegationCert)}</Label>
          <Value>{stakingKey.delegationCert}</Value>
        </Row>
      </SummaryCard>
    </React.Fragment>
  )
}

export default compose(withI18n)(UserStakingKey)
