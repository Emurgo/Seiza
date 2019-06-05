import React from 'react'
import {defineMessages} from 'react-intl'
import {Card} from '@material-ui/core'
import WithTabState from '@/components/headless/tabState'
import {Tab, Tabs} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import DelegatedPoolInfoTab from './DelegatedPoolInfoTab'
import HistoryTab from '../../shared/Tabs/HistoryTab'
import TransactionsTab from '../../shared/Tabs/TransactionsTab'

// Note: We have "currentColor" inside of these svg files
// which magically uses current inherited CSS color
import {ReactComponent as DelegatedPoolIcon} from '@/static/assets/icons/delegated-stakepool-info.svg'
import {ReactComponent as HistoryIcon} from '@/static/assets/icons/stakepool-history.svg'
import {ReactComponent as TransactionsIcon} from '@/static/assets/icons/transactions.svg'

const messages = defineMessages({
  delegatedPoolInfoTabName: 'Delegated Pool Info',
  historyTabName: 'History ({count, plural, =0 {# epochs} one {# epoch} other {# epochs}})',
  transactionsTabName: 'Transactions ({count})',
})

const TAB_NAMES = {
  DELEGATED_POOL_INFO: 'DELEGATED_POOL_INFO',
  HISTORY: 'HISTORY',
  TRANSACTIONS: 'TRANSACTIONS',
}

const TABS = {
  ORDER: [TAB_NAMES.DELEGATED_POOL_INFO, TAB_NAMES.HISTORY, TAB_NAMES.TRANSACTIONS],
  RENDER_CONTENT: {
    [TAB_NAMES.DELEGATED_POOL_INFO]: ({stakingKey}) => (
      <DelegatedPoolInfoTab
        stakePool={stakingKey.currentStakePool}
        epochsInCurrentStakePool={stakingKey.epochsInCurrentStakePool}
      />
    ),
    [TAB_NAMES.HISTORY]: ({stakingKey}) => (
      <HistoryTab history={stakingKey.currentStakePool.history} />
    ),
    [TAB_NAMES.TRANSACTIONS]: ({stakingKey}) => (
      <TransactionsTab transactions={stakingKey.currentStakePool.transactions} />
    ),
  },
}

const UserTabs = ({stakingKey}) => {
  const {translate: tr} = useI18n()

  return (
    <WithTabState tabNames={TABS.ORDER}>
      {({setTab, currentTab, currentTabName}) => {
        const TabContent = TABS.RENDER_CONTENT[currentTabName]
        return (
          <Card>
            <Tabs value={currentTab} onChange={setTab}>
              <Tab icon={<DelegatedPoolIcon />} label={tr(messages.delegatedPoolInfoTabName)} />
              <Tab
                icon={<HistoryIcon />}
                label={
                  <React.Fragment>
                    {tr(messages.historyTabName, {
                      count: stakingKey.currentStakePool.timeActive.epochs,
                    })}{' '}
                  </React.Fragment>
                }
              />
              <Tab
                icon={<TransactionsIcon />}
                label={
                  <React.Fragment>
                    {tr(messages.transactionsTabName, {
                      count: stakingKey.currentStakePool.transactions.length,
                    })}
                  </React.Fragment>
                }
              />
            </Tabs>
            <TabContent stakingKey={stakingKey} />
          </Card>
        )
      }}
    </WithTabState>
  )
}

export default UserTabs
