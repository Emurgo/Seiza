import React from 'react'
import {compose} from 'redux'

import {defineMessages} from 'react-intl'
import {withRouter} from 'react-router'
import {withProps} from 'recompose'
import {AdaValue, SummaryCard, SimpleLayout, EntityIdCard} from '@/components/visual'
import {withI18n} from '@/i18n/helpers'
import AdaIcon from '@/static/assets/icons/transaction-id.svg'
import RewardAddressIcon from '@/static/assets/icons/reward-address.svg'
import CertificateIcon from '@/static/assets/icons/certificate.svg'
import Tabs from './Tabs'
import {getUserStakingKey} from '../mockedData'

const messages = defineMessages({
  header: 'Staking Key',
  stakingKey: 'Staking Key Id',
  stakingTypeStakingPool: 'Staking Pool',
  stakingTypePending: 'Pending',
  creationDate: 'Creation Date:',
  stakedAda: 'Staked ADA:',
  addressesCount: '# Addresses:',
  addresses: '{count, plural, =0 {addresses} one {address} other {addresses}}',
  totalRewards: 'Total Rewards:',
  uncollectedRewards: 'Uncollected Rewards:',
  totalEpochsActive: 'Total Epochs Active:',
  epochs: '{count, plural, =0 {# epochs} one {# epoch} other {# epochs}}',
  rewardAddress: 'Reward Address:',
  delegationCert: 'Delegation Certificate:',
})

const UserStakingKey = ({stakingKey, i18n: {translate, formatTimestamp, formatInt}}) => {
  const {Row, Label, Value} = SummaryCard

  return (
    <SimpleLayout title={translate(messages.header)}>
      <EntityIdCard
        label={translate(messages.stakingKey)}
        value={stakingKey.hash}
        iconRenderer={<img alt="" src={AdaIcon} />}
      />

      <SummaryCard>
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
          <Label>{translate(messages.totalEpochsActive)}</Label>
          <Value>
            {translate(messages.epochs, {count: formatInt(stakingKey.totalEpochsActive)})}
          </Value>
        </Row>
      </SummaryCard>

      <EntityIdCard
        label={translate(messages.rewardAddress)}
        value={stakingKey.rewardAddress}
        iconRenderer={<img alt="" src={RewardAddressIcon} />}
      />
      <EntityIdCard
        label={translate(messages.delegationCert)}
        value={stakingKey.delegationCert}
        iconRenderer={<img alt="" src={CertificateIcon} />}
      />

      <Tabs stakingKey={stakingKey} />
    </SimpleLayout>
  )
}

export default compose(
  withI18n,
  withRouter,
  withProps((props) => ({
    // TODO: get data from backend
    stakingKey: getUserStakingKey(props.match.params.stakingKey),
  }))
)(UserStakingKey)
