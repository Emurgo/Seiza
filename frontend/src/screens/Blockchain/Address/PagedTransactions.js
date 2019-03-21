// @flow
import React from 'react'
import {compose} from 'redux'
import {withStateHandlers, withProps} from 'recompose'
import {defineMessages} from 'react-intl'
import cn from 'classnames'
import {Grid, Card, ButtonBase} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import WithTabState from '@/components/headless/tabState'
import {NavTypography} from '@/components/visual/Navbar'
import Pagination, {getPageCount} from '@/components/visual/Pagination'
import {EntityCardContent, SummaryCard, AdaValue} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import type {Transaction} from '@/__generated__/schema.flow'

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
    <Card>
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
const TABS = {
  ORDER: [TAB_NAMES.ALL, TAB_NAMES.SENT, TAB_NAMES.RECEIVED],
  CONTENT: {
    [TAB_NAMES.ALL]: TransactionList,
    [TAB_NAMES.SENT]: TransactionList,
    [TAB_NAMES.RECEIVED]: TransactionList,
  },
}

const TabHeader = ({onClick, isActive, label}) => {
  return (
    <ButtonBase onClick={onClick}>
      <NavTypography isActive={isActive}>{label}</NavTypography>
    </ButtonBase>
  )
}

const TabsHeader = ({tabState, paginationProps}) => {
  const {translate: tr} = useI18n()
  const {setTab, currentTabName} = tabState
  const {totalCount, onChangePage, rowsPerPage, page} = paginationProps
  return (
    <Grid container direction="row" justify="space-between">
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Grid container direction="row" justify="space-between">
          <Grid item>
            <TabHeader
              onClick={(event) => setTab(event, TABS.ORDER.indexOf(TAB_NAMES.ALL))}
              isActive={currentTabName === TAB_NAMES.ALL}
              label={tr(messages.all)}
            />
          </Grid>
          <Grid item>
            <TabHeader
              onClick={(event) => setTab(event, TABS.ORDER.indexOf(TAB_NAMES.SENT))}
              isActive={currentTabName === TAB_NAMES.SENT}
              label={tr(messages.sent)}
            />
          </Grid>
          <Grid item>
            <TabHeader
              onClick={(event) => setTab(event, TABS.ORDER.indexOf(TAB_NAMES.RECEIVED))}
              isActive={currentTabName === TAB_NAMES.RECEIVED}
              label={tr(messages.received)}
            />
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
  return (
    <WithTabState tabNames={TABS.ORDER}>
      {(tabState) => {
        const TabContent = TABS.CONTENT[tabState.currentTabName]
        return (
          <React.Fragment>
            <TabsHeader
              tabState={tabState}
              paginationProps={{totalCount, onChangePage, rowsPerPage, page}}
            />

            <TabContent transactions={currentTransactions} />
          </React.Fragment>
        )
      }}
    </WithTabState>
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
