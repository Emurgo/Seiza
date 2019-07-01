import React from 'react'
import {defineMessages} from 'react-intl'
import {Typography} from '@material-ui/core'
import useReactRouter from 'use-react-router'
import {makeStyles} from '@material-ui/styles'

import {
  SummaryCard,
  SimpleLayout,
  EntityIdCard,
  Link,
  LoadingError,
  LoadingInProgress,
} from '@/components/visual'
import {AdaValue} from '@/components/common'
import {routeTo} from '@/helpers/routes'
import {useI18n} from '@/i18n/helpers'
import AdaIcon from '@/static/assets/icons/transaction-id.svg'
import CertificateIcon from '@/static/assets/icons/reward-address.svg'
import RewardAddressIcon from '@/static/assets/icons/certificate.svg'
import Tabs from './Tabs'
import {useLoadStakingKeyData} from './dataLoaders'

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
  delegatedTo: 'Delegated to Pool:',
  inTransaction: 'In transaction:',
})

const useStyles = makeStyles(({spacing}) => ({
  tabsWrapper: {
    marginTop: spacing(2),
  },
  resetTextTransform: {
    textTransform: 'none',
  },
}))

const UserStakingKey = () => {
  const classes = useStyles()
  const {translate, formatTimestamp, formatInt} = useI18n()
  const {match} = useReactRouter()
  // TODO: handle error and loading once we have real data
  const {error, loading, data: stakingKey} = useLoadStakingKeyData(match.params.stakingKey)
  const {Row, Label, Value} = SummaryCard

  return (
    <SimpleLayout title={translate(messages.header)}>
      {error ? (
        <LoadingError error={error} />
      ) : loading ? (
        <LoadingInProgress />
      ) : (
        <React.Fragment>
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
            label={
              <React.Fragment>
                <Typography component="span" variant="overline" color="textSecondary">
                  {translate(messages.delegatedTo)}
                </Typography>{' '}
                {/* Note: EntityIdCard has variant="overline" on label,
                    that's why we manually disable it here */}
                <Typography
                  component="span"
                  variant="body1"
                  color="textPrimary"
                  className={classes.resetTextTransform}
                >
                  <Link to={routeTo.stakingKey.stakePool(stakingKey.delegation.stakePoolHash)}>
                    {stakingKey.delegation.stakePoolHash}
                  </Link>
                </Typography>
              </React.Fragment>
            }
            value={
              <React.Fragment>
                <Typography component="span" variant="overline" color="textSecondary">
                  {translate(messages.inTransaction)}
                </Typography>{' '}
                <Typography component="span" variant="body1" color="textPrimary">
                  <Link to={routeTo.transaction(stakingKey.delegation.tx)}>
                    {stakingKey.delegation.tx}
                  </Link>
                </Typography>
              </React.Fragment>
            }
            iconRenderer={<img alt="" src={CertificateIcon} />}
            showCopyIcon={false}
          />
          <div className={classes.tabsWrapper}>
            <Tabs stakingKey={stakingKey} />
          </div>
        </React.Fragment>
      )}
    </SimpleLayout>
  )
}

export default UserStakingKey
