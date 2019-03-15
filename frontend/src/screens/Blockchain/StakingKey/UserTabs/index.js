import React from 'react'
import {defineMessages} from 'react-intl'
import {Paper} from '@material-ui/core'
import WithTabState from '@/components/headless/tabState'
import {Tab, Tabs} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import DelegatedPoolInfoTab from './DelegatedPoolInfoTab'
import HistoryTab from './HistoryTab'
import TransactionsTab from './TransactionsTab'

// Note: We have "currentColor" inside of these svg files
// which magically uses current inherited CSS color
import {ReactComponent as DelegatedPoolIcon} from '@/assets/icons/delegated-stakepool-info.svg'
import {ReactComponent as HistoryIcon} from '@/assets/icons/stakepool-history.svg'
import {ReactComponent as TransactionsIcon} from '@/assets/icons/transactions.svg'

const messages = defineMessages({
  delegatedPoolInfoName: 'Delegated Pool Info',
  historyName: 'History',
  transactionsName: 'Transactions',
})

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
