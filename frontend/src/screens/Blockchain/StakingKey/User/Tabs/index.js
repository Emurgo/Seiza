import React from 'react'
import {defineMessages} from 'react-intl'
import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {LiteTab, LiteTabs, LoadingInProgress} from '@/components/visual'
import {LoadingError} from '@/components/common'
import {useI18n} from '@/i18n/helpers'
import DelegatedPoolInfoTab from './DelegatedPoolInfoTab'
import HistoryTab from '../../common/History'
import TransactionsTab from '../../common/TransactionsTab'
import {useLoadStakingKeyHistory} from '../dataLoaders'

const messages = defineMessages({
  delegatedPoolInfoTabName: 'Delegated Pool Info',
  historyTabName: 'History ({count, plural, =0 {# epochs} one {# epoch} other {# epochs}})',
  transactionsTabName: 'Transactions ({count})',
})

export const TAB_NAMES = {
  DELEGATED_POOL_INFO: 'DELEGATED_POOL_INFO',
  HISTORY: 'HISTORY',
  TRANSACTIONS: 'TRANSACTIONS',
}

const TABS_CONTENT = {
  [TAB_NAMES.DELEGATED_POOL_INFO]: ({stakingKey}) => (
    <DelegatedPoolInfoTab
      stakePool={stakingKey.currentStakepool}
      epochsInCurrentStakePool={stakingKey.epochsInCurrentStakepool}
    />
  ),
  [TAB_NAMES.HISTORY]: ({stakingKey}) => {
    const {error, loading, data: stakingKeyHistory} = useLoadStakingKeyHistory(stakingKey.hash)
    return error ? (
      <LoadingError error={error} />
    ) : loading ? (
      <LoadingInProgress />
    ) : (
      <HistoryTab history={stakingKeyHistory} />
    )
  },
  [TAB_NAMES.TRANSACTIONS]: ({stakingKey}) => (
    <TransactionsTab transactions={stakingKey.currentStakepool.transactions} />
  ),
}

const useStyles = makeStyles((theme) => ({
  headerWrapper: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  headerPagination: {
    marginTop: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      marginTop: 0,
    },
  },
}))

const StakingKeyTabs = ({stakingKey, pagination, tabState}) => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  const {setTabByEventIndex, currentTabIndex, currentTab} = tabState
  const TabContent = TABS_CONTENT[currentTab]

  return (
    <React.Fragment>
      <Grid container className={classes.headerWrapper}>
        <Grid item>
          <LiteTabs value={currentTabIndex} onChange={setTabByEventIndex}>
            <LiteTab label={tr(messages.delegatedPoolInfoTabName)} />
            <LiteTab
              label={
                <React.Fragment>
                  {tr(messages.historyTabName, {
                    count: stakingKey.currentStakepool.timeActive.epochs,
                  })}{' '}
                </React.Fragment>
              }
            />
            <LiteTab
              label={
                <React.Fragment>
                  {tr(messages.transactionsTabName, {
                    count: stakingKey.currentStakepool.transactions.length,
                  })}
                </React.Fragment>
              }
            />
          </LiteTabs>
        </Grid>
        <Grid item className={classes.headerPagination}>
          {pagination}
        </Grid>
      </Grid>
      <TabContent stakingKey={stakingKey} />
      <Grid container justify="flex-end">
        <Grid item>{pagination}</Grid>
      </Grid>
    </React.Fragment>
  )
}

export default StakingKeyTabs
