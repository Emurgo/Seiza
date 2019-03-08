import React from 'react'
import {compose} from 'redux'

import {defineMessages} from 'react-intl'
import {withRouter} from 'react-router'
import {withProps} from 'recompose'
import {AdaValue, SummaryCard, SimpleLayout, EntityIdCard} from '@/components/visual'
import AdaIcon from '@/assets/icons/transaction-id.svg'
import {withI18n} from '@/i18n/helpers'
import RewardAddressIcon from '@/assets/icons/reward-address.svg'
import CertificateIcon from '@/assets/icons/certificate.svg'

const I18N_PREFIX = 'blockchain.stakingKey.user'

const messages = defineMessages({
  header: {
    id: `${I18N_PREFIX}.header`,
    defaultMessage: 'Staking Key',
  },
  stakingKey: {
    id: `${I18N_PREFIX}.entityId`,
    defaultMessage: 'Staking Key Id',
  },
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
  totalEpochsActive: {
    id: `${I18N_PREFIX}.totalEpochsActive`,
    defaultMessage: 'Total Epochs Active:',
  },
  epochs: {
    id: `${I18N_PREFIX}.epochs`,
    defaultMessage: '{count, plural, =0 {# epochs} one {# epoch} other {# epochs}}',
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

const UserStakingKey = ({stakingKeyHash, i18n: {translate, formatTimestamp, formatInt}}) => {
  // TODO: get data from backend
  const stakingKey = {
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
  const {Row, Label, Value} = SummaryCard

  return (
    <SimpleLayout title={translate(messages.header)}>
      <EntityIdCard
        label={translate(messages.stakingKey)}
        value={stakingKeyHash}
        iconRenderer={<img alt="" src={AdaIcon} />}
      />

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
    </SimpleLayout>
  )
}

export default compose(
  withI18n,
  withRouter,
  withProps((props) => ({
    stakingKeyHash: props.match.params.stakingKey,
  }))
)(UserStakingKey)
