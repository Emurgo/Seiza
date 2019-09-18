// @flow
import React from 'react'
import {defineMessages, FormattedMessage} from 'react-intl'
import useReactRouter from 'use-react-router'
import {Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {ObjectValues} from '@/helpers/flow'
import {useManageQueryValue} from '@/components/hooks/useManageQueryValue'
import useTabState from '@/components/hooks/useTabState'
import {toIntOrNull, getPageCount} from '@/helpers/utils'

import {SummaryCard, SimpleLayout, Alert, LoadingInProgress} from '@/components/visual'
import {
  AdaValue,
  LoadingError,
  EntityIdCard,
  Link,
  ResponsiveCircularProgressBar,
  Pagination,
  EntityEllipsize,
  Ellipsize,
} from '@/components/common'
import {useI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'
import AdaIcon from '@/static/assets/icons/transaction-id.svg'
import CertificateActionIcon from '@/static/assets/icons/reward-address.svg'
import RewardAddressIcon from '@/static/assets/icons/certificate.svg'
import {useLoadStakepoolData} from './dataLoaders'
import Tabs, {TAB_NAMES} from './Tabs'

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

const usePaginations = () => {
  const [historyPage, onHistoryPageChange] = useManageQueryValue('history-page', 1, toIntOrNull)
  const [transactionsPage, onTransactionsPageChange] = useManageQueryValue(
    'txs-page',
    1,
    toIntOrNull
  )

  return {
    [TAB_NAMES.HISTORY]: {page: historyPage, onChangePage: onHistoryPageChange},
    [TAB_NAMES.TRANSACTIONS]: {page: transactionsPage, onChangePage: onTransactionsPageChange},
  }
}

const useManageTabs = () => {
  const tabNames = ObjectValues(TAB_NAMES)
  const [currentTab, setTab] = useManageQueryValue('tab', tabNames[0])
  const tabState = useTabState(tabNames, null, currentTab, setTab)
  const paginations = usePaginations()
  return {
    pagination: paginations[currentTab],
    tabState,
  }
}

const ROWS_PER_PAGE = 10

const Stakepool = () => {
  const classes = useStyles()
  const {Row, Label, Value} = SummaryCard
  const {translate: tr, formatPercent, formatInt, formatTimestamp, formatAda} = useI18n()
  const {match} = useReactRouter()
  const {data: stakepool, loading, error} = useLoadStakepoolData(match.params.poolHash)
  const {pagination, tabState} = useManageTabs()
  const totalCount = 1 // TODO: handle totalCount once we have real data

  return (
    <SimpleLayout title={stakepool.name}>
      {error ? (
        <LoadingError error={error} />
      ) : loading ? (
        <LoadingInProgress />
      ) : (
        <React.Fragment>
          <Alert type="warning" message={tr(messages.poolRetiredWarning)} />

          <EntityIdCard
            label={tr(messages.stakepoolHash)}
            value={<Ellipsize value={stakepool.hash} xs={2} sm={6} />}
            iconRenderer={<img alt="" src={AdaIcon} />}
            badge={
              <ResponsiveCircularProgressBar
                label={tr(messages.entityBadge)}
                value={stakepool.revenue}
              />
            }
            ellipsizeValue={false}
          />
          <SummaryCard>
            <Row>
              <Label>{tr(messages.stakingPoolName)}</Label>
              <Value>{stakepool.name}</Value>
            </Row>
            <Row>
              <Label>{tr(messages.validationCharacters)}</Label>
              <Value>{stakepool.validationCharacters}</Value>
            </Row>
            <Row>
              <Label>{tr(messages.creationDate)}</Label>
              <Value>{formatTimestamp(stakepool.createdAt)}</Value>
            </Row>
            <Row>
              <Label>{tr(messages.webpage)}</Label>
              <Value>
                <Link external bold to={stakepool.webpage}>
                  <Typography noWrap>{stakepool.webpage}</Typography>
                </Link>
              </Value>
            </Row>
            <Row>
              <Label>{tr(messages.pledge)}</Label>
              <Value>
                <AdaValue value={stakepool.pledge} showCurrency />
              </Value>
            </Row>
            <Row>
              <Label>{tr(messages.totalStakedAda)}</Label>
              <Value>
                <AdaValue value={stakepool.totalAdaStaked} showCurrency />
              </Value>
            </Row>
            <Row>
              <Label>{tr(messages.performance)}</Label>
              <Value>{formatPercent(stakepool.performance)}</Value>
            </Row>
            <Row>
              <Label>{tr(messages.totalRewards)}</Label>
              <Value>
                <Typography variant="body1">
                  <AdaValue value={stakepool.totalRewards.amount} showCurrency />
                </Typography>
                <Typography variant="caption" color="textSecondary">
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
              <Label>{tr(messages.totalActiveEpochs)}</Label>
              <Value>
                {tr(messages.epochs, {count: stakepool.timeActive.epochs})}{' '}
                {tr(messages.days, {count: stakepool.timeActive.days})}
              </Value>
            </Row>
            <Row>
              <Label>{tr(messages.stakersCount)}</Label>
              <Value>
                {formatInt(stakepool.stakersCount)}{' '}
                {tr(messages.stakers, {count: stakepool.stakersCount})}
              </Value>
            </Row>
            <Row>
              <Label>{tr(messages.margin)}</Label>
              <Value>
                <Typography variant="body1">
                  {formatPercent(stakepool.currentMargin.margin)}{' '}
                  <FromTop1Message
                    value={formatPercent(stakepool.topPoolComparison.margin, {
                      showSign: 'always',
                    })}
                  />
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {tr(messages.lastUpdate)} {formatTimestamp(stakepool.currentMargin.updatedAt)}
                </Typography>
              </Value>
            </Row>
            <Row>
              <Label>{tr(messages.cost)}</Label>
              <Value>
                <Typography variant="body1">
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
                <Typography variant="caption" color="textSecondary">
                  {tr(messages.lastUpdate)} {formatTimestamp(stakepool.currentCost.updatedAt)}
                </Typography>
              </Value>
            </Row>
            <Row>
              <Label>{tr(messages.fullness)}</Label>
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
              <Label>{tr(messages.revenue)}</Label>
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
              <Label>{tr(messages.description)}</Label>
              <Value>{stakepool.description}</Value>
            </Row>
          </SummaryCard>
          <EntityIdCard
            label={tr(messages.rewardAddress)}
            value={
              <Link monospace to={routeTo.address(stakepool.rewardsAddress)}>
                <EntityEllipsize value={stakepool.rewardsAddress} />
              </Link>
            }
            iconRenderer={<img alt="" src={RewardAddressIcon} />}
            rawValue={stakepool.rewardAddress}
            ellipsizeValue={false}
          />
          <EntityIdCard
            label={tr(messages.stakePoolCertificate)}
            value={stakepool.stakePoolCertificate}
            iconRenderer={<img alt="" src={CertificateActionIcon} />}
          />
          <Tabs
            stakepool={stakepool}
            tabState={tabState}
            pagination={
              pagination && (
                <Pagination
                  pageCount={getPageCount(totalCount, ROWS_PER_PAGE)}
                  page={pagination.page}
                  onChangePage={pagination.onChangePage}
                />
              )
            }
          />
        </React.Fragment>
      )}
    </SimpleLayout>
  )
}

export default Stakepool
