// @flow
import React from 'react'
import {defineMessages} from 'react-intl'
import idx from 'idx'
import {Grid, Hidden} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {useManageQueryValue} from '@/components/hooks/useManageQueryValue'
import {toIntOrNull} from '@/helpers/utils'
import Pagination from '@/components/visual/Pagination'
// import type {Transaction} from '@/__generated__/schema.flow'

import {
  LoadingInProgress,
  EntityCardContent,
  SummaryCard,
  AdaValue,
  Link,
  LiteTabs,
  LiteTab,
  Card,
} from '@/components/visual'
import {getDefaultSpacing} from '@/components/visual/ContentSpacing'
import useTabState from '@/components/hooks/useTabState'
import {ObjectValues} from '@/helpers/flow'
import {useI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'
import {TabsProvider as Tabs, TabItem as Tab, useTabContext} from '@/components/context/TabContext'
import {AddressesBreakdownContent} from '@/components/common/AddressesBreakdown'

const messages = defineMessages({
  transactionEntity: 'Transaction Id',
  amount: 'Amount:',
  fee: 'Fee:',
  epochAndSlot: 'Epoch / Slot:',
  creationDate: 'Date:',
  all: 'All',
  sent: 'Sent',
  received: 'Received',
  NA: 'N/A',
})

const useStyles = makeStyles((theme) => ({
  txCard: {
    padding: `${getDefaultSpacing(theme) * 0.5}px ${getDefaultSpacing(theme)}px`,
    borderBottom: `1px solid ${theme.palette.unobtrusiveContentHighlight}`,
  },
  leftSide: {
    borderRight: `1px solid ${theme.palette.contentUnfocus}`,
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
}))

const TransactionCard = ({transaction: tx, targetAddress}) => {
  const {translate: tr, formatInt, formatTimestamp} = useI18n()
  const classes = useStyles()
  const {Row, Label, Value} = SummaryCard
  const NA = tr(messages.NA)

  const data = {
    amount: idx(tx, (_) => _.amount),
    fees: idx(tx, (_) => _.fees),
    blockHash: idx(tx, (_) => _.block.blockHash),
    epoch: idx(tx, (_) => _.block.epoch),
    slot: idx(tx, (_) => _.block.slot),
    creationDate: idx(tx, (_) => _.creationDate),
  }

  const __ = {
    amount: <AdaValue showCurrency value={data.amount} noValue={NA} />,
    fees: <AdaValue showCurrency value={data.fees} noValue={NA} />,
    epoch:
      data.epoch != null ? (
        // $FlowFixMe flow does not understand idx precondition
        <Link to={routeTo.epoch(data.epoch)}>{formatInt(data.epoch)}</Link>
      ) : (
        NA
      ),
    slot:
      data.slot != null ? (
        // $FlowFixMe flow does not understand idx precondition
        <Link to={routeTo.block(data.blockHash)}>{formatInt(data.slot)}</Link>
      ) : (
        NA
      ),
    creationDate: formatTimestamp(data.creationDate, {defaultValue: NA}),
  }

  return (
    <Card>
      <div className={classes.txCard}>
        <EntityCardContent
          label={tr(messages.transactionEntity)}
          value={<Link to={routeTo.transaction(tx.txHash)}>{tx.txHash}</Link>}
          rawValue={tx.txHash}
        />
      </div>
      <Grid container direction="row">
        <Grid item xs={12} sm={12} md={6} className={classes.leftSide}>
          <Grid container direction="column">
            <Row>
              <Label>{tr(messages.amount)}</Label>
              <Value>{__.amount}</Value>
            </Row>
            <Row showLastSeparator>
              <Label>{tr(messages.fee)}</Label>
              <Value>{__.fees}</Value>
            </Row>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Grid container direction="column">
            <Row>
              <Label>{tr(messages.epochAndSlot)}</Label>
              <Value>
                {__.epoch} / {__.slot}
              </Value>
            </Row>
            <Row showLastSeparator>
              <Label>{tr(messages.creationDate)}</Label>
              <Value>{__.creationDate}</Value>
            </Row>
          </Grid>
        </Grid>
      </Grid>

      <AddressesBreakdownContent targetAddress={targetAddress} tx={tx} />
    </Card>
  )
}

const TransactionList = ({transactions = [], targetAddress}) => {
  return transactions.map((tx) => (
    <TransactionCard targetAddress={targetAddress} key={tx.txHash} transaction={tx} />
  ))
}

const TAB_NAMES = {
  ALL: 'ALL',
  SENT: 'SENT',
  RECEIVED: 'RECEIVED',
}

const TabsHeader = ({tabState, pagination}) => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  const {currentTabIndex, setTabByEventIndex} = useTabContext()
  const tabs = [
    {id: TAB_NAMES.ALL, label: tr(messages.all)},
    {id: TAB_NAMES.SENT, label: tr(messages.sent)},
    {id: TAB_NAMES.RECEIVED, label: tr(messages.received)},
  ]

  return (
    <Grid container className={classes.headerWrapper}>
      <Grid item>
        <LiteTabs value={currentTabIndex} onChange={setTabByEventIndex}>
          {tabs.map(({id, label}) => (
            <LiteTab key={id} label={label} />
          ))}
        </LiteTabs>
      </Grid>
      <Grid item>{pagination}</Grid>
    </Grid>
  )
}

const ROWS_PER_PAGE = 3

type Props = {|
  loading: boolean,
  targetAddress: string,
  // Note: amount, creation are incompatible with backend schema
  transactions: Array<Object>, // Array<Transaction>,
|}

const useManagePaginations = (currentTab) => {
  const [tabOnePage, onTabOnePageChange] = useManageQueryValue(TAB_NAMES.ALL, 1, toIntOrNull)
  const [tabTwoPage, onTabTwoPageChange] = useManageQueryValue(TAB_NAMES.SENT, 1, toIntOrNull)
  const [tabThreePage, onTabThreePageChange] = useManageQueryValue(
    TAB_NAMES.RECEIVED,
    1,
    toIntOrNull
  )

  return {
    [TAB_NAMES.ALL]: [tabOnePage, onTabOnePageChange],
    [TAB_NAMES.SENT]: [tabTwoPage, onTabTwoPageChange],
    [TAB_NAMES.RECEIVED]: [tabThreePage, onTabThreePageChange],
  }[currentTab]
}

const PagedTransactions = ({loading, transactions, targetAddress}: Props) => {
  const rowsPerPage = ROWS_PER_PAGE
  const tabNames = ObjectValues(TAB_NAMES)

  const [currentTab, setTab] = useManageQueryValue('tab', tabNames[0])
  const tabState = useTabState(tabNames, null, currentTab, setTab)

  const [page, onChangePage] = useManagePaginations(tabState.currentTab)

  // TODO: better handle loading
  if (loading) return <LoadingInProgress />

  const totalCount = transactions.length
  const from = (page - 1) * rowsPerPage
  const currentTransactions = transactions.slice(from, from + rowsPerPage)

  const pagination = (
    <Pagination
      count={totalCount}
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={onChangePage}
    />
  )

  return (
    <React.Fragment>
      <Tabs {...tabState}>
        <TabsHeader pagination={pagination} />
        <Tab name={TAB_NAMES.ALL}>
          <TransactionList targetAddress={targetAddress} transactions={currentTransactions} />
        </Tab>
        <Tab name={TAB_NAMES.SENT}>
          <TransactionList targetAddress={targetAddress} transactions={currentTransactions} />
        </Tab>
        <Tab name={TAB_NAMES.RECEIVED}>
          <TransactionList targetAddress={targetAddress} transactions={currentTransactions} />
        </Tab>
      </Tabs>
      <Hidden mdUp>{pagination}</Hidden>
    </React.Fragment>
  )
}

export default PagedTransactions
