import React from 'react'
import {defineMessages} from 'react-intl'
import {makeStyles} from '@material-ui/styles'
import useTabState from '@/components/hooks/useTabState'
import {LiteTabs, LiteTab} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import HistoryTab from '../../common/HistoryTab'
import TransactionsTab from '../../common/TransactionsTab'

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
    [TAB_NAMES.HISTORY]: ({stakepool}) => <HistoryTab history={stakepool.history} />,
    [TAB_NAMES.TRANSACTIONS]: ({stakepool}) => (
      <TransactionsTab transactions={stakepool.transactions} />
    ),
  },
}

const useStyles = makeStyles(({spacing}) => ({
  tabsWrapper: {
    marginTop: spacing(4),
    marginBottom: spacing(4),
  },
}))

const StakepoolTabs = ({stakepool}) => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  const {setTabByEventIndex, currentTabIndex, currentTab} = useTabState(TABS.ORDER)

  const TabContent = TABS.RENDER_CONTENT[currentTab]
  return (
    <div>
      <div className={classes.tabsWrapper}>
        <LiteTabs value={currentTabIndex} onChange={setTabByEventIndex}>
          <LiteTab
            label={
              <React.Fragment>
                {tr(messages.historyTabName, {
                  count: stakepool.timeActive.epochs,
                })}{' '}
              </React.Fragment>
            }
          />
          <LiteTab
            label={
              <React.Fragment>
                {tr(messages.transactionsTabName, {
                  count: stakepool.transactions.length,
                })}
              </React.Fragment>
            }
          />
        </LiteTabs>
      </div>
      <TabContent stakepool={stakepool} />
    </div>
  )
}

export default StakepoolTabs
