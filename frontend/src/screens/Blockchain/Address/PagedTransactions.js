// @flow
import React from 'react'
import {compose} from 'redux'
import {withStateHandlers, withProps} from 'recompose'
import {defineMessages} from 'react-intl'
import idx from 'idx'
import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import Pagination, {getPageCount} from '@/components/visual/Pagination'
import type {Transaction} from '@/__generated__/schema.flow'

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
}))

const TransactionCard = ({transaction: tx}) => {
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
        <Grid item xs={6} className={classes.leftSide}>
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
        <Grid item xs={6}>
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

      <AddressesBreakdownContent tx={tx} />
    </Card>
  )
}

const TransactionList = ({transactions = []}) => {
  return transactions.map((tx) => <TransactionCard key={tx.txHash} transaction={tx} />)
}

const TAB_NAMES = {
  ALL: 'ALL',
  SENT: 'SENT',
  RECEIVED: 'RECEIVED',
}

const TabsHeader = ({tabState, paginationProps}) => {
  const {translate: tr} = useI18n()
  const {currentTabIndex, setTabByEventIndex} = useTabContext()
  const {totalCount, onChangePage, rowsPerPage, page} = paginationProps
  const tabs = [
    {id: TAB_NAMES.ALL, label: tr(messages.all)},
    {id: TAB_NAMES.SENT, label: tr(messages.sent)},
    {id: TAB_NAMES.RECEIVED, label: tr(messages.received)},
  ]

  return (
    <Grid container direction="row" justify="space-between">
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Grid container direction="row" justify="space-between">
          <Grid item>
            <LiteTabs alignLeft value={currentTabIndex} onChange={setTabByEventIndex}>
              {tabs.map(({id, label}) => (
                <LiteTab key={id} label={label} />
              ))}
            </LiteTabs>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Grid container direction="row" justify="flex-end">
          <Pagination
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={onChangePage}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

const PagedTransactions = ({
  loading,
  currentTransactions,
  totalCount,
  onChangePage,
  rowsPerPage,
  page,
}) => {
  const tabNames = ObjectValues(TAB_NAMES)
  const tabState = useTabState(tabNames)
  // TODO: better handle loading
  if (loading) return <LoadingInProgress />
  return (
    <Tabs {...tabState}>
      <TabsHeader paginationProps={{totalCount, onChangePage, rowsPerPage, page}} />
      <Tab name={TAB_NAMES.ALL}>
        <TransactionList transactions={currentTransactions} />
      </Tab>
      <Tab name={TAB_NAMES.SENT}>
        <TransactionList transactions={currentTransactions} />
      </Tab>
      <Tab name={TAB_NAMES.RECEIVED}>
        <TransactionList transactions={currentTransactions} />
      </Tab>
    </Tabs>
  )
}

type ExternalProps = {
  transactions: Array<Transaction>,
}

const ROWS_PER_PAGE = 3

export default (compose(
  withProps((props) => {
    const totalCount = props.transactions.length
    const pageCount = getPageCount(totalCount, ROWS_PER_PAGE)
    return {totalCount, pageCount, rowsPerPage: ROWS_PER_PAGE}
  }),
  withStateHandlers(
    {page: 0},
    {
      onChangePage: () => (page) => ({page}),
    }
  ),
  withProps(({page, totalCount, pageCount, transactions, rowsPerPage}) => {
    const from = page * rowsPerPage
    return {
      currentTransactions: transactions.slice(from, from + rowsPerPage),
    }
  })
)(PagedTransactions): React$ComponentType<ExternalProps>)
