// @flow
import React from 'react'
import {defineMessages} from 'react-intl'
import {withRouter} from 'react-router'
import {withProps} from 'recompose'
import {compose} from 'redux'
import {
  AdaValue,
  SummaryCard,
  ExternalLink,
  SimpleLayout,
  EntityIdCard,
  Alert,
  CircularProgressBar,
} from '@/components/visual'
import {withI18n} from '@/i18n/helpers'
import AdaIcon from '@/assets/icons/transaction-id.svg'
import {getStakePoolStakingKey} from './mockedData'

const messages = defineMessages({
  header: 'Staking Key',
  stakingKey: 'Staking Key Id',
  entityBadge: 'Revenue',
  poolRetiredWarning: 'Stake Pool is retired',
  poolSaturatedWarning: 'Stake Pool is overly saturated',
  poolNotCompetitive: 'Stake pool is not in the top 100',
  stakingType: 'Staking Type:',
  stakingTypeStakingPool: 'Staking Pool:',
  stakingPoolName: 'Name:',
  validationCharacters: 'Validation Characters:',
  creationDate: 'Creation Date:',
  webpage: 'Webpage:',
  pledge: 'Pledge:',
  totalStakedAda: 'Total Staked ADA:',
  performance: 'Performance:',
  totalRewards: 'Total Rewards:',
  totalActiveEpochs: 'Total Active Epochs:',
  epochs: '{count, plural, =0 {epochs} one {epoch} other {epochs}}',
  stakersCount: '# Stakers:',
  stakers: '{count, plural, =0 {stakers} one {staker} other {stakers}}',
  margin: 'Margin:',
  cost: 'Cost:',
  fullness: 'Fullness:',
  revenue: 'Revenue:',
  description: 'Description:',
  rewardAddress: 'Reward Address:',
  stakePoolCertificate: 'Stake Pool Certificate:',
  lastUpdate: 'Last Update On:',
  fromTop1Begin: '(',
  fromTop1End: ' from Top 1)',
  fromTop1EndDot: ' from Top 1).',
})

const StakePoolStakingKey = ({
  stakePool,
  i18n: {translate, formatPercent, formatInt, formatTimestamp},
}) => {
  const {Row, Label, Value} = SummaryCard
  return (
    <SimpleLayout title={translate(messages.header)}>
      <Alert warning message={translate(messages.poolRetiredWarning)} />

      <EntityIdCard
        label={translate(messages.stakingKey)}
        value={stakePool.hash}
        iconRenderer={<img alt="" src={AdaIcon} width={40} height={40} />}
        badge={
          <CircularProgressBar label={translate(messages.entityBadge)} value={stakePool.revenue} />
        }
      />
      <SummaryCard>
        <Row>
          <Label>{translate(messages.stakingType)}</Label>
          <Value>{translate(messages.stakingTypeStakingPool)}</Value>
        </Row>
        <Row>
          <Label>{translate(messages.stakingPoolName)}</Label>
          <Value>{stakePool.name}</Value>
        </Row>
        <Row>
          <Label>{translate(messages.validationCharacters)}</Label>
          <Value>...{stakePool.validationCharacters}</Value>
        </Row>
        <Row>
          <Label>{translate(messages.creationDate)}</Label>
          <Value>{formatTimestamp(stakePool.createdAt)}</Value>
        </Row>
        <Row>
          <Label>{translate(messages.webpage)}</Label>
          <Value>
            <ExternalLink to={stakePool.webpage}>{stakePool.webpage}</ExternalLink>
          </Value>
        </Row>
        <Row>
          <Label>{translate(messages.pledge)}</Label>
          <Value>
            <AdaValue value={stakePool.pledge} showCurrency />
          </Value>
        </Row>
        <Row>
          <Label>{translate(messages.totalStakedAda)}</Label>
          <Value>
            <AdaValue value={stakePool.totalAdaStaked} showCurrency />
          </Value>
        </Row>
        <Row>
          <Label>{translate(messages.performance)}</Label>
          <Value>{formatPercent(stakePool.performance)}</Value>
        </Row>
        <Row>
          <Label>{translate(messages.totalRewards)}</Label>
          <Value>
            <AdaValue value={stakePool.totalRewards} showCurrency />
          </Value>
        </Row>
        <Row>
          <Label>{translate(messages.totalActiveEpochs)}</Label>
          <Value>
            {formatInt(stakePool.totalActiveEpochs)}{' '}
            {translate(messages.epochs, {count: stakePool.totalActiveEpochs})}
          </Value>
        </Row>
        <Row>
          <Label>{translate(messages.stakersCount)}</Label>
          <Value>
            {formatInt(stakePool.stakersCount)}{' '}
            {translate(messages.stakers, {count: stakePool.stakersCount})}
          </Value>
        </Row>
        <Row>
          <Label>{translate(messages.margin)}</Label>
          <Value>
            {formatPercent(stakePool.currentMargin.margin)} {translate(messages.fromTop1Begin)}
            {formatPercent(stakePool.topPoolComparison.margin, {
              withSign: true,
            })}
            {translate(messages.fromTop1EndDot)} {translate(messages.lastUpdate)}{' '}
            {formatTimestamp(stakePool.currentMargin.updatedAt)}
          </Value>
        </Row>
        <Row>
          <Label>{translate(messages.cost)}</Label>
          <Value>
            <AdaValue value={stakePool.currentCost.cost} showCurrency />
            {translate(messages.fromTop1Begin)}
            <AdaValue value={stakePool.topPoolComparison.cost} withSign showCurrency />
            {translate(messages.fromTop1EndDot)} {translate(messages.lastUpdate)}{' '}
            {formatTimestamp(stakePool.currentCost.updatedAt)}
          </Value>
        </Row>
        <Row>
          <Label>{translate(messages.fullness)}</Label>
          <Value>
            {formatPercent(stakePool.fullness)} {translate(messages.fromTop1Begin)}
            {formatPercent(stakePool.topPoolComparison.fullness, {
              withSign: true,
            })}
            {translate(messages.fromTop1End)}
          </Value>
        </Row>
        <Row>
          <Label>{translate(messages.revenue)}</Label>
          <Value>
            {formatPercent(stakePool.revenue)} {translate(messages.fromTop1Begin)}
            {formatPercent(stakePool.topPoolComparison.revenue, {
              withSign: true,
            })}
            {translate(messages.fromTop1End)}
          </Value>
        </Row>
        <Row>
          <Label>{translate(messages.description)}</Label>
          <Value>{stakePool.description}</Value>
        </Row>
      </SummaryCard>
      <SummaryCard>
        <Row>
          <Label>{translate(messages.rewardAddress)}</Label>
          <Value>{stakePool.rewardsAddress}</Value>
        </Row>
      </SummaryCard>
      <SummaryCard>
        <Row>
          <Label>{translate(messages.stakePoolCertificate)}</Label>
          <Value>{stakePool.stakePoolCertificate}</Value>
        </Row>
      </SummaryCard>
    </SimpleLayout>
  )
}

export default compose(
  withI18n,
  withRouter,
  withProps((props) => ({
    // TODO: get data from backend
    stakePool: getStakePoolStakingKey(props.match.params.stakingKey),
  }))
)(StakePoolStakingKey)
