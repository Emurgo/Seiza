import React from 'react'
import {defineMessages, FormattedMessage} from 'react-intl'
import _ from 'lodash'
import {Typography} from '@material-ui/core'
import useReactRouter from 'use-react-router'
import {makeStyles} from '@material-ui/styles'

import {SummaryCard, SimpleLayout, LoadingInProgress} from '@/components/visual'
import {
  AdaValue,
  LoadingError,
  EntityIdCard,
  Link,
  Pagination,
  EntityEllipsize,
} from '@/components/common'
import {useManageQueryValue} from '@/components/hooks/useManageQueryValue'
import useTabState from '@/components/hooks/useTabState'
import {toIntOrNull, getPageCount} from '@/helpers/utils'
import {routeTo} from '@/helpers/routes'
import {useI18n} from '@/i18n/helpers'
import {ObjectValues} from '@/helpers/flow'
import AdaIcon from '@/static/assets/icons/transaction-id.svg'
import CertificateActionIcon from '@/static/assets/icons/reward-address.svg'
import RewardAddressIcon from '@/static/assets/icons/certificate.svg'
import Tabs, {TAB_NAMES} from './Tabs'
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
  currentStatusLabel: 'Current Status:',
  statusDeregistered: 'De-registered since transaction: {txHash}',
  statusDelegating: 'Currently active, delegating to {poolHash}',
  statusNotDelegating: 'Currently active, but not delegating to any pool',
})

const useStyles = makeStyles(({spacing}) => ({
  resetTextTransform: {
    textTransform: 'none',
  },
  valueContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
  },
}))

const CurrentStatus = () => {
  // TODO: add logic to pick the right status message
  const pick = _.random(0, 2)
  const {translate: tr} = useI18n()
  if (pick === 0) {
    return (
      <FormattedMessage
        id={messages.statusDeregistered.id}
        values={{
          txHash: <Link to={routeTo.transaction('0x1234')}>0x1234</Link>,
        }}
      />
    )
  } else if (pick === 1) {
    return (
      <FormattedMessage
        id={messages.statusDelegating.id}
        values={{
          poolHash: <Link to={routeTo.stakepool('0x1234')}>0x1234</Link>,
        }}
      />
    )
  } else {
    return tr(messages.statusNotDelegating)
  }
}

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
    currentTab,
    setTab,
  }
}

const ROWS_PER_PAGE = 10

const StakingKey = () => {
  const classes = useStyles()
  const {translate, formatTimestamp, formatInt} = useI18n()
  const {match} = useReactRouter()
  // TODO: handle error and loading once we have real data
  const {error, loading, data: stakingKey} = useLoadStakingKeyData(match.params.stakingKey)
  const {pagination, tabState} = useManageTabs()
  const totalCount = 1 // TODO: handle totalCount once we have real data

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
          <EntityIdCard
            label={translate(messages.currentStatusLabel)}
            value={<CurrentStatus />}
            iconRenderer={<img alt="" src={RewardAddressIcon} />}
            showCopyIcon={false}
            monospaceValue={false}
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
            value={
              <Link monospace to={routeTo.address(stakingKey.rewardAddress)}>
                <EntityEllipsize value={stakingKey.rewardAddress} />
              </Link>
            }
            iconRenderer={<img alt="" src={RewardAddressIcon} />}
            rawValue={stakingKey.rewardAddress}
            ellipsizeValue={false}
          />
          <EntityIdCard
            label={null}
            value={
              <div className={classes.valueContainer}>
                <div className="d-flex">
                  <Typography
                    component="span"
                    variant="overline"
                    color="textSecondary"
                    className={classes.label}
                  >
                    {translate(messages.delegatedTo)}
                  </Typography>
                  &nbsp;
                  <Typography
                    component="span"
                    variant="body1"
                    color="textPrimary"
                    className={classes.resetTextTransform}
                    noWrap
                  >
                    <Link monospace to={routeTo.stakepool(stakingKey.delegation.stakePoolHash)}>
                      <EntityEllipsize value={stakingKey.delegation.stakePoolHash} />
                    </Link>
                  </Typography>
                </div>
                <div className="d-flex">
                  <Typography
                    component="span"
                    variant="overline"
                    color="textSecondary"
                    className={classes.label}
                  >
                    {translate(messages.inTransaction)}
                  </Typography>
                  &nbsp;
                  <Typography component="span" variant="body1" color="textPrimary" noWrap>
                    <Link monospace to={routeTo.transaction(stakingKey.delegation.tx)}>
                      <EntityEllipsize value={stakingKey.delegation.tx} />
                    </Link>
                  </Typography>
                </div>
              </div>
            }
            iconRenderer={<img alt="" src={CertificateActionIcon} />}
            showCopyIcon={false}
          />
          <Tabs
            stakingKey={stakingKey}
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

export default StakingKey
