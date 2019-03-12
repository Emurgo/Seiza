import React from 'react'
import {defineMessages} from 'react-intl'
import {Paper, Typography} from '@material-ui/core'
import WithTabState from '@/components/headless/tabState'
import {SummaryCard, AdaValue, Tab, Tabs} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import HistoryTab from './HistoryTab'

// Note: We have "currentColor" inside of these svg files
// which magically uses current CSS color inherited
import {ReactComponent as DelegatedPoolIcon} from '@/assets/icons/delegated-stakepool-info.svg'
import {ReactComponent as HistoryIcon} from '@/assets/icons/stakepool-history.svg'
import {ReactComponent as TransactionsIcon} from '@/assets/icons/transactions.svg'

const messages = defineMessages({
  delegatedPoolInfoName: 'Delegated Pool Info',
  historyName: 'History',
  transactionsName: 'Transactions',
})

const delegatedPoolMessages = defineMessages({
  stakePool: 'Stake Pool',
  stakePoolPosition: 'Stake Pool Position',
  marginDiff: 'Stake Pool Margin Difference with Top #1',
  costDiff: 'Stake Pool Cost Difference with Top #1',
  perfDiff: 'Stake Pool Performance diff with Top #1',
  currentTopStakePool: 'Current Top Stake Pool',
  epochsCount: 'Epochs in current stake pool',
  epochs: '{count, plural, =0 {# epochs} one {# epoch} other {# epochs}}',
})

const DelegatedPoolInfoTab = ({stakingKey}) => {
  const {translate, formatInt, formatPercent} = useI18n()
  const {Row, Label, Value} = SummaryCard
  const {currentStakePool: stakePool} = stakingKey

  return (
    <React.Fragment>
      <SummaryCard>
        <Row>
          <Label>{translate(delegatedPoolMessages.stakePool)}</Label>
          <Value>
            {stakePool.name} {stakePool.hash}
          </Value>
        </Row>
        <Row>
          <Label>{translate(delegatedPoolMessages.stakePoolPosition)}</Label>
          <Value>#{formatInt(stakePool.topPoolComparison.position)}</Value>
        </Row>
        <Row>
          <Label>{translate(delegatedPoolMessages.marginDiff)}</Label>
          <Value>
            {formatPercent(stakePool.currentMargin.margin)} (
            {formatPercent(stakePool.topPoolComparison.margin, {withSign: true})})
          </Value>
        </Row>
        <Row>
          <Label>{translate(delegatedPoolMessages.costDiff)}</Label>
          <Value>
            <AdaValue value={stakePool.currentCost.cost} showCurrency /> (
            <AdaValue value={stakePool.topPoolComparison.cost} showCurrency />)
          </Value>
        </Row>
        <Row>
          <Label>{translate(delegatedPoolMessages.perfDiff)}</Label>
          <Value>
            {formatPercent(stakePool.performance)} (
            {formatPercent(stakePool.topPoolComparison.performance, {withSign: true})})
          </Value>
        </Row>
        <Row>
          <Label>{translate(delegatedPoolMessages.currentTopStakePool)}</Label>
          <Value>
            <React.Fragment>
              <Typography variant="body1" color="textSecondary" align="right">
                {stakePool.topPoolComparison.topPool.name}
              </Typography>
              <Typography variant="body1" align="right">
                {stakePool.topPoolComparison.topPool.hash}
              </Typography>
            </React.Fragment>
          </Value>
        </Row>
        <Row>
          <Label>{translate(delegatedPoolMessages.epochsCount)}</Label>
          <Value>
            {translate(delegatedPoolMessages.epochs, {
              count: formatInt(stakingKey.epochsInCurrentStakePool),
            })}
          </Value>
        </Row>
      </SummaryCard>
    </React.Fragment>
  )
}
const TransactionsTab = () => {
  return <div>TransactionsTab</div>
}

const TAB_NAMES = {
  DELEGATED_POOL_INFO: 'DELEGATED_POOL_INFO',
  HISTORY: 'HISTORY',
  TRANSACTIONS: 'TRANSACTIONS',
}

const TABS = {
  ORDER: [TAB_NAMES.DELEGATED_POOL_INFO, TAB_NAMES.HISTORY, TAB_NAMES.TRANSACTIONS],
  CONTENT: {
    [TAB_NAMES.DELEGATED_POOL_INFO]: DelegatedPoolInfoTab,
    [TAB_NAMES.HISTORY]: HistoryTab,
    [TAB_NAMES.TRANSACTIONS]: TransactionsTab,
  },
}

const StakingPoolTabs = ({stakingKey}) => {
  const {translate} = useI18n()

  return (
    <WithTabState tabNames={TABS.ORDER}>
      {({setTab, currentTab, currentTabName}) => {
        const TabContent = TABS.CONTENT[currentTabName]
        return (
          <Paper>
            <Tabs value={currentTab} onChange={setTab}>
              <Tab icon={<DelegatedPoolIcon />} label={translate(messages.delegatedPoolInfoName)} />
              <Tab icon={<HistoryIcon />} label={translate(messages.historyName)} />
              <Tab icon={<TransactionsIcon />} label={translate(messages.transactionsName)} />
            </Tabs>
            <TabContent stakingKey={stakingKey} />
          </Paper>
        )
      }}
    </WithTabState>
  )
}

export default StakingPoolTabs
