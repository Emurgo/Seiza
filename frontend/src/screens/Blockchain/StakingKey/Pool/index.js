// @flow
import React from 'react'
import {defineMessages, FormattedMessage} from 'react-intl'
import useReactRouter from 'use-react-router'
import {Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {
  AdaValue,
  SummaryCard,
  ExternalLink,
  SimpleLayout,
  EntityIdCard,
  Alert,
  CircularProgressBar,
  LoadingError,
  LoadingInProgress,
} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import AdaIcon from '@/static/assets/icons/transaction-id.svg'
import CertificateIcon from '@/static/assets/icons/reward-address.svg'
import RewardAddressIcon from '@/static/assets/icons/certificate.svg'
import {useLoadStakepoolData} from './dataLoaders'
import Tabs from './Tabs'

const useStyles = makeStyles((theme) => ({
  smallAdaText: {
    fontWeight: 500,
  },
}))

const messages = defineMessages({
  stakepoolHash: 'Stakepool Id',
  entityBadge: 'Revenue',
  poolRetiredWarning: 'Stake Pool is retired',
  poolSaturatedWarning: 'Stake Pool is overly saturated',
  poolNotCompetitive: 'Stake pool is not in the top 100',
  stakingPoolName: 'Name:',
  validationCharacters: 'Validation Characters:',
  creationDate: 'Creation Date:',
  webpage: 'Webpage:',
  pledge: 'Pledge:',
  totalStakedAda: 'Total Staked ADA:',
  performance: 'Performance:',
  totalRewards: 'Total Rewards:',
  totalActiveEpochs: 'Total Active Epochs:',
  epochs: '{count, plural, =0 {# epochs} one {# epoch} other {# epochs}}',
  days: '({count, plural, =0 {# days} one {# day} other {# days}})',
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
  fromTop1: '({value} from Top 1)',
  estimatedMissed: 'Estimated: {count} missed',
})

const FromTop1Message = ({value}) => (
  // $FlowFixMe
  <FormattedMessage id={messages.fromTop1.id} values={{value}} />
)

const StakePool = () => {
  const classes = useStyles()
  const {Row, Label, Value} = SummaryCard
  const {translate, formatPercent, formatInt, formatTimestamp, formatAda} = useI18n()
  const {match} = useReactRouter()
  const {data: stakePool, loading, error} = useLoadStakepoolData(match.params.stakingKey)

  return (
    <SimpleLayout title={stakePool.name}>
      {error ? (
        <LoadingError error={error} />
      ) : loading ? (
        <LoadingInProgress />
      ) : (
        <React.Fragment>
          <Alert type="warning" message={translate(messages.poolRetiredWarning)} />

          <EntityIdCard
            label={translate(messages.stakepoolHash)}
            value={stakePool.hash}
            iconRenderer={<img alt="" src={AdaIcon} width={40} height={40} />}
            badge={
              <CircularProgressBar
                label={translate(messages.entityBadge)}
                value={stakePool.revenue}
              />
            }
          />
          <SummaryCard>
            <Row>
              <Label>{translate(messages.stakingPoolName)}</Label>
              <Value>{stakePool.name}</Value>
            </Row>
            <Row>
              <Label>{translate(messages.validationCharacters)}</Label>
              <Value>{stakePool.validationCharacters}</Value>
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
                <Typography variant="body1" align="right">
                  <AdaValue value={stakePool.totalRewards.amount} showCurrency />
                </Typography>
                <Typography variant="caption" color="textSecondary" align="right">
                  <FormattedMessage
                    // $FlowFixMe
                    id={messages.estimatedMissed.id}
                    values={{
                      count: (
                        <span className={classes.smallAdaText}>
                          {formatAda(stakePool.totalRewards.estimatedMissed)} ADA
                        </span>
                      ),
                    }}
                  />
                </Typography>
              </Value>
            </Row>
            <Row>
              <Label>{translate(messages.totalActiveEpochs)}</Label>
              <Value>
                {translate(messages.epochs, {count: stakePool.timeActive.epochs})}{' '}
                {translate(messages.days, {count: stakePool.timeActive.days})}
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
                <Typography variant="body1" align="right">
                  {formatPercent(stakePool.currentMargin.margin)}{' '}
                  <FromTop1Message
                    value={formatPercent(stakePool.topPoolComparison.margin, {
                      showSign: 'always',
                    })}
                  />
                </Typography>
                <Typography variant="caption" color="textSecondary" align="right">
                  {translate(messages.lastUpdate)}{' '}
                  {formatTimestamp(stakePool.currentMargin.updatedAt)}
                </Typography>
              </Value>
            </Row>
            <Row>
              <Label>{translate(messages.cost)}</Label>
              <Value>
                <Typography variant="body1" align="right">
                  <AdaValue value={stakePool.currentCost.cost} showCurrency />
                  <FromTop1Message
                    value={
                      <AdaValue
                        value={stakePool.topPoolComparison.cost}
                        showSign="always"
                        showCurrency
                      />
                    }
                  />
                </Typography>
                <Typography variant="caption" color="textSecondary" align="right">
                  {translate(messages.lastUpdate)}{' '}
                  {formatTimestamp(stakePool.currentCost.updatedAt)}
                </Typography>
              </Value>
            </Row>
            <Row>
              <Label>{translate(messages.fullness)}</Label>
              <Value>
                {formatPercent(stakePool.fullness)}{' '}
                <FromTop1Message
                  value={formatPercent(stakePool.topPoolComparison.fullness, {
                    showSign: 'always',
                  })}
                />
              </Value>
            </Row>
            <Row>
              <Label>{translate(messages.revenue)}</Label>
              <Value>
                {formatPercent(stakePool.revenue)}{' '}
                <FromTop1Message
                  value={formatPercent(stakePool.topPoolComparison.revenue, {
                    showSign: 'always',
                  })}
                />
              </Value>
            </Row>
            <Row>
              <Label>{translate(messages.description)}</Label>
              <Value>{stakePool.description}</Value>
            </Row>
          </SummaryCard>
          <EntityIdCard
            label={translate(messages.rewardAddress)}
            value={stakePool.rewardsAddress}
            iconRenderer={<img alt="" src={RewardAddressIcon} width={40} height={40} />}
          />
          <EntityIdCard
            label={translate(messages.stakePoolCertificate)}
            value={stakePool.stakePoolCertificate}
            iconRenderer={<img alt="" src={CertificateIcon} width={40} height={40} />}
          />
          <Tabs stakePool={stakePool} />
        </React.Fragment>
      )}
    </SimpleLayout>
  )
}

export default StakePool
