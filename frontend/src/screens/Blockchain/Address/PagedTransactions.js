// @flow
import React, {useCallback} from 'react'
import {defineMessages} from 'react-intl'
import idx from 'idx'
import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
// import type {Transaction} from '@/__generated__/schema.flow'

import {
  LoadingInProgress,
  LoadingError,
  EntityCardContent,
  SummaryCard,
  AdaValue,
  Link,
  LiteTabs,
  LiteTab,
  Card,
} from '@/components/visual'
import {getDefaultSpacing} from '@/components/visual/ContentSpacing'
import {useI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'
import {TabsProvider as Tabs, TabItem as Tab, useTabContext} from '@/components/context/TabContext'
import {AddressesBreakdownContent} from '@/components/common/AddressesBreakdown'
import {FILTER_TYPES} from './constants'

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
    [theme.breakpoints.up('md')]: {
      borderRight: `1px solid ${theme.palette.contentUnfocus}`,
    },
  },
  headerWrapper: {
    // TODO: change to mobile first
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  headerPagination: {
    marginTop: 0,
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(2),
    },
  },
}))

const TransactionCard = ({transaction: tx, targetAddress}) => {
  const {translate: tr, formatInt, formatTimestamp} = useI18n()
  const classes = useStyles()
  const {Row, Label, Value} = SummaryCard
  const NA = tr(messages.NA)

  const data = {
    amount: idx(tx, (_) => _.totalOutput),
    fees: idx(tx, (_) => _.fees),
    blockHash: idx(tx, (_) => _.block.blockHash),
    epoch: idx(tx, (_) => _.block.epoch),
    slot: idx(tx, (_) => _.block.slot),
    creationDate: idx(tx, (_) => _.block.timeIssued),
  }

  const __ = {
    amount: (
      <AdaValue showCurrency value={data.amount} noValue={NA} timestamp={data.creationDate} />
    ),
    fees: <AdaValue showCurrency value={data.fees} noValue={NA} timestamp={data.creationDate} />,
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
          <Grid container direction="row">
            <Grid item xs={12}>
              <Row showLastSeparator>
                <Label>{tr(messages.amount)}</Label>
                <Value>{__.amount}</Value>
              </Row>
            </Grid>
            <Grid item xs={12}>
              <Row showLastSeparator>
                <Label>{tr(messages.fee)}</Label>
                <Value>{__.fees}</Value>
              </Row>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Grid container direction="row">
            <Grid item xs={12}>
              <Row showLastSeparator>
                <Label>{tr(messages.epochAndSlot)}</Label>
                <Value>
                  {__.epoch} / {__.slot}
                </Value>
              </Row>
            </Grid>
            <Grid item xs={12}>
              <Row showLastSeparator>
                <Label>{tr(messages.creationDate)}</Label>
                <Value>{__.creationDate}</Value>
              </Row>
            </Grid>
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

const TabsHeader = ({pagination, changeFilterType}) => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  const {currentTabIndex, setTabByEventIndex} = useTabContext()
  const useClickHandler = (type) => useCallback(() => changeFilterType(type), [type])

  const allOnClick = useClickHandler(FILTER_TYPES.ALL)
  const sentOnClick = useClickHandler(FILTER_TYPES.SENT)
  const receivedOnClick = useClickHandler(FILTER_TYPES.RECEIVED)

  const tabs = [
    {id: FILTER_TYPES.ALL, label: tr(messages.all), onClick: allOnClick},
    {id: FILTER_TYPES.SENT, label: tr(messages.sent), onClick: sentOnClick},
    {id: FILTER_TYPES.RECEIVED, label: tr(messages.received), onClick: receivedOnClick},
  ]

  return (
    <Grid container className={classes.headerWrapper}>
      <Grid item>
        <LiteTabs value={currentTabIndex} onChange={setTabByEventIndex}>
          {tabs.map(({id, label, onClick}) => (
            <LiteTab key={id} label={label} onClick={onClick} />
          ))}
        </LiteTabs>
      </Grid>
      <Grid item className={classes.headerPagination}>
        {pagination}
      </Grid>
    </Grid>
  )
}

type Props = {|
  error: any,
  loading: boolean,
  targetAddress: string,
  // Note: amount, creation are incompatible with backend schema
  transactions: Array<Object>, // Array<Transaction>,
  filterType: string,
  changeFilterType: Function,
  tabState: Object,
  pagination: React$Node,
|}

const PagedTransactions = ({
  error,
  loading,
  transactions,
  targetAddress,
  filterType,
  changeFilterType,
  paginationProps,
  tabState,
  pagination,
}: Props) => {
  const tabContent = loading ? (
    <LoadingInProgress />
  ) : error ? (
    <LoadingError error={error} />
  ) : (
    <TransactionList targetAddress={targetAddress} transactions={transactions} />
  )

  return (
    <React.Fragment>
      <Tabs {...tabState}>
        <TabsHeader changeFilterType={changeFilterType} pagination={pagination} />
        <Tab name={FILTER_TYPES.ALL}>{tabContent}</Tab>
        <Tab name={FILTER_TYPES.SENT}>{tabContent}</Tab>
        <Tab name={FILTER_TYPES.RECEIVED}>{tabContent}</Tab>
      </Tabs>
      {transactions && transactions.length > 1 && (
        <Grid container justify="flex-end">
          <Grid item>{pagination}</Grid>
        </Grid>
      )}
    </React.Fragment>
  )
}

export default PagedTransactions
