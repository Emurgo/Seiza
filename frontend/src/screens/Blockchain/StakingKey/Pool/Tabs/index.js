import React from 'react'
import {defineMessages} from 'react-intl'
import {makeStyles} from '@material-ui/styles'
import useTabState from '@/components/hooks/useTabState'
import {LiteTabs, LiteTab} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import HistoryTab from '../../shared/Tabs/HistoryTab'
import TransactionsTab from '../../shared/Tabs/TransactionsTab'
import {MOCKED_CERTIFICATES} from '../../../Certificates/helpers'

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
      <TransactionsTab transactions={stakePool.transactions} certificates={MOCKED_CERTIFICATES} />
    ),
  },
}

const useStyles = makeStyles(({spacing}) => ({
  tabsWrapper: {
    marginTop: spacing(4),
    marginBottom: spacing(4),
  },
}))

const StakingPoolTabs = ({stakePool}) => {
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
                  count: stakePool.timeActive.epochs,
                })}{' '}
              </React.Fragment>
            }
          />
          <LiteTab
            label={
              <React.Fragment>
                {tr(messages.transactionsTabName, {
                  count: stakePool.transactions.length,
                })}
              </React.Fragment>
            }
          />
        </LiteTabs>
      </div>
      <TabContent stakePool={stakePool} />
    </div>
  )
}

export default StakingPoolTabs
