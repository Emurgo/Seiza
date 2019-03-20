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
  historyTabName: 'History ({count, plural, =0 {# epochs} one {# epoch} other {# epochs}})',
  transactionsTabName: 'Transactions ({count})',
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
  const {translate: tr} = useI18n()

  return (
    <WithTabState tabNames={TABS.ORDER}>
      {({setTab, currentTab, currentTabName}) => {
        const TabContent = TABS.RENDER_CONTENT[currentTabName]
        return (
          <Paper>
            <Tabs value={currentTab} onChange={setTab}>
              <Tab
                icon={<HistoryIcon />}
                label={
                  <React.Fragment>
                    {tr(messages.historyTabName, {
                      count: stakePool.timeActive.epochs,
                    })}{' '}
                  </React.Fragment>
                }
              />
              <Tab
                icon={<TransactionsIcon />}
                label={
                  <React.Fragment>
                    {tr(messages.transactionsTabName, {
                      count: stakePool.transactions.length,
                    })}
                  </React.Fragment>
                }
              />
            </Tabs>
            <TabContent stakePool={stakePool} />
          </Paper>
        )
      }}
    </WithTabState>
  )
}

export default StakingPoolTabs
