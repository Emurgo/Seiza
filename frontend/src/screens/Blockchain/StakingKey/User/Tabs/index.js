import React from 'react'
import {defineMessages} from 'react-intl'
import {makeStyles} from '@material-ui/styles'
import {LiteTab, LiteTabs} from '@/components/visual'
import useTabState from '@/components/hooks/useTabState'
import {useI18n} from '@/i18n/helpers'
import DelegatedPoolInfoTab from './DelegatedPoolInfoTab'
import HistoryTab from '../../shared/Tabs/HistoryTab'
import TransactionsTab from '../../shared/Tabs/TransactionsTab'
import {MOCKED_CERTIFICATES} from '../../../Certificates/helpers'

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
      <TransactionsTab
        transactions={stakingKey.currentStakePool.transactions}
        certificates={MOCKED_CERTIFICATES}
      />
    ),
  },
}

const useStyles = makeStyles(({spacing}) => ({
  tabs: {
    marginTop: spacing(4),
    marginBottom: spacing(4),
  },
}))

const UserTabs = ({stakingKey}) => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  const {setTabByEventIndex, currentTabIndex, currentTab} = useTabState(TABS.ORDER)
  const TabContent = TABS.RENDER_CONTENT[currentTab]

  return (
    <React.Fragment>
      <LiteTabs className={classes.tabs} value={currentTabIndex} onChange={setTabByEventIndex}>
        <LiteTab label={tr(messages.delegatedPoolInfoTabName)} />
        <LiteTab
          label={
            <React.Fragment>
              {tr(messages.historyTabName, {
                count: stakingKey.currentStakePool.timeActive.epochs,
              })}{' '}
            </React.Fragment>
          }
        />
        <LiteTab
          label={
            <React.Fragment>
              {tr(messages.transactionsTabName, {
                count: stakingKey.currentStakePool.transactions.length,
              })}
            </React.Fragment>
          }
        />
      </LiteTabs>

      <TabContent stakingKey={stakingKey} />
    </React.Fragment>
  )
}

export default UserTabs
