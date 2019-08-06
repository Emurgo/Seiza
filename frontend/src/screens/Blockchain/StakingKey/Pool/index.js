// @flow
import React from 'react'
import {defineMessages, FormattedMessage} from 'react-intl'
import useReactRouter from 'use-react-router'
import {Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {
  SummaryCard,
  ExternalLink,
  SimpleLayout,
  Alert,
  LoadingInProgress,
} from '@/components/visual'
import {
  AdaValue,
  LoadingError,
  EntityIdCard,
  Link,
  ResponsiveCircularProgressBar,
} from '@/components/common'
import {useI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'
import AdaIcon from '@/static/assets/icons/transaction-id.svg'
import CertificateActionIcon from '@/static/assets/icons/reward-address.svg'
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

const Stakepool = () => {
  const classes = useStyles()
  const {Row, Label, Value} = SummaryCard
  const {translate, formatPercent, formatInt, formatTimestamp, formatAda} = useI18n()
  const {match} = useReactRouter()
  const {data: stakepool, loading, error} = useLoadStakepoolData(match.params.poolHash)

  return (
    <SimpleLayout title={stakepool.name}>
      {error ? (
        <LoadingError error={error} />
      ) : loading ? (
        <LoadingInProgress />
      ) : (
        <React.Fragment>
          <Alert type="warning" message={translate(messages.poolRetiredWarning)} />

          <EntityIdCard
            label={translate(messages.stakepoolHash)}
            value={stakepool.hash}
            iconRenderer={<img alt="" src={AdaIcon} />}
            badge={
              <ResponsiveCircularProgressBar
                label={translate(messages.entityBadge)}
                value={stakepool.revenue}
              />
            }
          />
          <SummaryCard>
            <Row>
              <Label>{translate(messages.stakingPoolName)}</Label>
              <Value>{stakepool.name}</Value>
            </Row>
            <Row>
              <Label>{translate(messages.validationCharacters)}</Label>
              <Value>{stakepool.validationCharacters}</Value>
            </Row>
            <Row>
              <Label>{translate(messages.creationDate)}</Label>
              <Value>{formatTimestamp(stakepool.createdAt)}</Value>
            </Row>
            <Row>
              <Label>{translate(messages.webpage)}</Label>
              <Value>
                <ExternalLink to={stakepool.webpage}>{stakepool.webpage}</ExternalLink>
              </Value>
            </Row>
            <Row>
              <Label>{translate(messages.pledge)}</Label>
              <Value>
                <AdaValue value={stakepool.pledge} showCurrency />
              </Value>
            </Row>
            <Row>
              <Label>{translate(messages.totalStakedAda)}</Label>
              <Value>
                <AdaValue value={stakepool.totalAdaStaked} showCurrency />
              </Value>
            </Row>
            <Row>
              <Label>{translate(messages.performance)}</Label>
              <Value>{formatPercent(stakepool.performance)}</Value>
            </Row>
            <Row>
              <Label>{translate(messages.totalRewards)}</Label>
              <Value>
                <Typography variant="body1" align="right">
                  <AdaValue value={stakepool.totalRewards.amount} showCurrency />
                </Typography>
                <Typography variant="caption" color="textSecondary" align="right">
                  <FormattedMessage
                    // $FlowFixMe
                    id={messages.estimatedMissed.id}
                    values={{
                      count: (
                        <span className={classes.smallAdaText}>
                          {formatAda(stakepool.totalRewards.estimatedMissed)} ADA
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
                {translate(messages.epochs, {count: stakepool.timeActive.epochs})}{' '}
                {translate(messages.days, {count: stakepool.timeActive.days})}
              </Value>
            </Row>
            <Row>
              <Label>{translate(messages.stakersCount)}</Label>
              <Value>
                {formatInt(stakepool.stakersCount)}{' '}
                {translate(messages.stakers, {count: stakepool.stakersCount})}
              </Value>
            </Row>
            <Row>
              <Label>{translate(messages.margin)}</Label>
              <Value>
                <Typography variant="body1" align="right">
                  {formatPercent(stakepool.currentMargin.margin)}{' '}
                  <FromTop1Message
                    value={formatPercent(stakepool.topPoolComparison.margin, {
                      showSign: 'always',
                    })}
                  />
                </Typography>
                <Typography variant="caption" color="textSecondary" align="right">
                  {translate(messages.lastUpdate)}{' '}
                  {formatTimestamp(stakepool.currentMargin.updatedAt)}
                </Typography>
              </Value>
            </Row>
            <Row>
              <Label>{translate(messages.cost)}</Label>
              <Value>
                <Typography variant="body1" align="right">
                  <AdaValue value={stakepool.currentCost.cost} showCurrency />
                  <FromTop1Message
                    value={
                      <AdaValue
                        value={stakepool.topPoolComparison.cost}
                        showSign="always"
                        showCurrency
                      />
                    }
                  />
                </Typography>
                <Typography variant="caption" color="textSecondary" align="right">
                  {translate(messages.lastUpdate)}{' '}
                  {formatTimestamp(stakepool.currentCost.updatedAt)}
                </Typography>
              </Value>
            </Row>
            <Row>
              <Label>{translate(messages.fullness)}</Label>
              <Value>
                {formatPercent(stakepool.fullness)}{' '}
                <FromTop1Message
                  value={formatPercent(stakepool.topPoolComparison.fullness, {
                    showSign: 'always',
                  })}
                />
              </Value>
            </Row>
            <Row>
              <Label>{translate(messages.revenue)}</Label>
              <Value>
                {formatPercent(stakepool.revenue)}{' '}
                <FromTop1Message
                  value={formatPercent(stakepool.topPoolComparison.revenue, {
                    showSign: 'always',
                  })}
                />
              </Value>
            </Row>
            <Row>
              <Label>{translate(messages.description)}</Label>
              <Value>{stakepool.description}</Value>
            </Row>
          </SummaryCard>
          <EntityIdCard
            label={translate(messages.rewardAddress)}
            value={
              <Link monospace to={routeTo.address(stakepool.rewardsAddress)}>
                {stakepool.rewardsAddress}
              </Link>
            }
            iconRenderer={<img alt="" src={RewardAddressIcon} />}
          />
          <EntityIdCard
            label={translate(messages.stakePoolCertificate)}
            value={stakepool.stakePoolCertificate}
            iconRenderer={<img alt="" src={CertificateActionIcon} />}
          />
          <Tabs stakepool={stakepool} />
        </React.Fragment>
      )}
    </SimpleLayout>
  )
}

export default Stakepool
