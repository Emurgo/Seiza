import React from 'react'
import {defineMessages} from 'react-intl'
import {Paper} from '@material-ui/core'
import WithTabState from '@/components/headless/tabState'
import {Tab, Tabs} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import HistoryTab from '../../shared/Tabs/HistoryTab'
import TransactionsTab from '../../shared/Tabs/TransactionsTab'

// Note: We have "currentColor" inside of these svg files
// which magically uses current inherited CSS color
import {ReactComponent as HistoryIcon} from '@/assets/icons/stakepool-history.svg'
import {ReactComponent as TransactionsIcon} from '@/assets/icons/transactions.svg'

const messages = defineMessages({
  historyName: 'History',
  transactionsName: 'Transactions',
})

const TAB_NAMES = {
  HISTORY: 'HISTORY',
  TRANSACTIONS: 'TRANSACTIONS',
}

const TABS = {
  ORDER: [TAB_NAMES.HISTORY, TAB_NAMES.TRANSACTIONS],
  RENDER_CONTENT: {
    [TAB_NAMES.HISTORY]: ({stakePool}) => <HistoryTab history={stakePool.history} />,
    [TAB_NAMES.TRANSACTIONS]: ({stakePool}) => (
      <TransactionsTab transactions={stakePool.transactions} />
    ),
  },
}

const StakingPoolTabs = ({stakePool}) => {
  const {translate} = useI18n()

  return (
    <WithTabState tabNames={TABS.ORDER}>
      {({setTab, currentTab, currentTabName}) => {
        const TabContent = TABS.RENDER_CONTENT[currentTabName]
        return (
          <Paper>
            <Tabs value={currentTab} onChange={setTab}>
              <Tab icon={<HistoryIcon />} label={translate(messages.historyName)} />
              <Tab icon={<TransactionsIcon />} label={translate(messages.transactionsName)} />
            </Tabs>
            <TabContent stakePool={stakePool} />
          </Paper>
        )
      }}
    </WithTabState>
  )
}

export default StakingPoolTabs
