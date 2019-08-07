import React from 'react'
import {defineMessages} from 'react-intl'
import {makeStyles} from '@material-ui/styles'
import {Grid} from '@material-ui/core'
import {LiteTabs, LiteTab, LoadingInProgress} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import HistoryTab from '../../common/History'
import TransactionsTab from '../../common/TransactionsTab'
import {LoadingError, TabsPaginationLayout} from '@/components/common'
import {useLoadStakepoolHistory} from '../dataLoaders'

const messages = defineMessages({
  historyTabName: 'History ({count, plural, =0 {# epochs} one {# epoch} other {# epochs}})',
  transactionsTabName: 'Transactions ({count})',
})

export const TAB_NAMES = {
  HISTORY: 'HISTORY',
  TRANSACTIONS: 'TRANSACTIONS',
}

const TABS_CONTENT = {
  [TAB_NAMES.HISTORY]: ({stakepool}) => {
    const {error, loading, data: stakepoolHistory} = useLoadStakepoolHistory(stakepool.hash)
    return error ? (
      <LoadingError error={error} />
    ) : loading ? (
      <LoadingInProgress />
    ) : (
      <HistoryTab history={stakepoolHistory} />
    )
  },
  [TAB_NAMES.TRANSACTIONS]: ({stakepool}) => (
    <TransactionsTab transactions={stakepool.transactions} />
  ),
}

const StakepoolTabs = ({stakepool, pagination, tabState}) => {
  // const classes = useStyles()
  const {translate: tr} = useI18n()
  const {setTabByEventIndex, currentTabIndex, currentTab} = tabState
  const TabContent = TABS_CONTENT[currentTab]

  return (
    <React.Fragment>
      <TabsPaginationLayout
        tabs={
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
        }
        pagination={pagination}
      />

      <TabContent stakepool={stakepool} />
      <Grid container justify="flex-end">
        <Grid item>{pagination}</Grid>
      </Grid>
    </React.Fragment>
  )
}

export default StakepoolTabs
