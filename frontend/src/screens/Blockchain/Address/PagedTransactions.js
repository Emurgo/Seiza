// @flow
import React from 'react'
import {compose} from 'redux'
import {withStateHandlers, withProps} from 'recompose'
import {defineMessages} from 'react-intl'
import cn from 'classnames'
import {Grid, Card} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import Pagination, {getPageCount} from '@/components/visual/Pagination'
import {EntityCardContent, SummaryCard, AdaValue, LiteTabs, LiteTab} from '@/components/visual'
import useTabState from '@/components/hooks/useTabState'
import {ObjectValues} from '@/helpers/flow'
import {useI18n} from '@/i18n/helpers'
import {TabsProvider as Tabs, TabItem as Tab, useTabContext} from '@/components/context/TabContext'
import type {Transaction} from '@/__generated__/schema.flow'
import {getPadding} from '@/components/visual/LiteTabs'

const messages = defineMessages({
  transactionEntity: 'Transaction Id',
  amount: 'Amount:',
  fee: 'Fee:',
  epochAndSlot: 'Epoch / Slot:',
  creationDate: 'Creation Date:',
  all: 'All',
  sent: 'Sent',
  received: 'Received',
})

const getSpacing = (theme) => theme.spacing.unit * 4

const useStyles = makeStyles((theme) => ({
  txCard: {
    padding: `${theme.spacing.unit * 2}px ${getSpacing(theme)}px`,
    borderBottom: `1px solid ${theme.palette.unobtrusiveContentHighlight}`,
  },
  leftSide: {
    borderRight: `1px solid ${theme.palette.contentUnfocus}`,
  },
  bothSides: {
    padding: getSpacing(theme),
  },
}))

const TransactionCard = ({transaction: tx}) => {
  const {translate: tr, formatInt} = useI18n()
  const classes = useStyles()
  const {Row, Label, Value} = SummaryCard
  return (
    <Card elevation={6}>
      <div className={classes.txCard}>
        <EntityCardContent label={tr(messages.transactionEntity)} value={tx.txHash} />
      </div>
      <Grid container direction="row">
        <Grid item xs={6} className={cn(classes.leftSide, classes.bothSides)}>
          <Grid container direction="column">
            <Row>
              <Label>{tr(messages.amount)}</Label>
              <Value>TODO</Value>
            </Row>
            <Row>
              <Label>{tr(messages.fee)}</Label>
              <Value>
                <AdaValue showCurrency value={tx.fees} />
              </Value>
            </Row>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container direction="column" className={classes.bothSides}>
            <Row>
              <Label>{tr(messages.epochAndSlot)}</Label>
              <Value>
                {formatInt(tx.block.epoch)} / {formatInt(tx.block.slot)}
              </Value>
            </Row>
            <Row>
              <Label>{tr(messages.creationDate)}</Label>
              <Value>TODO</Value>
            </Row>
          </Grid>
        </Grid>
      </Grid>
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

const useLiteTabsClasses = makeStyles((theme) => ({
  root: {
    transform: `translateX(-${getPadding(theme)}px)`,
  },
}))

const TabsHeader = ({tabState, paginationProps}) => {
  const {translate: tr} = useI18n()
  const classes = useLiteTabsClasses()
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
            <LiteTabs value={currentTabIndex} onChange={setTabByEventIndex} classes={classes}>
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

const PagedTransactions = ({currentTransactions, totalCount, onChangePage, rowsPerPage, page}) => {
  const tabNames = ObjectValues(TAB_NAMES)
  const tabState = useTabState(tabNames)
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
