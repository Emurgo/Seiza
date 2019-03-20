import React from 'react'
import {defineMessages} from 'react-intl'
import {makeStyles} from '@material-ui/styles'

import TransactionCard from '@/components/common/TransactionCard'
import {AdaValue, SummaryCard, Pagination} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'

const useStyles = makeStyles((theme) => ({
  paginationWrapper: {
    marginTop: theme.spacing.unit * 6,
    marginBottom: theme.spacing.unit * 6,
  },
}))

const transactionMessages = defineMessages({
  epoch: 'Epoch:',
  slot: 'Slot:',
  date: 'Date:',
  action: 'Action:',
  actionValue: 'Action Value:',
})

const actionMessages = defineMessages({
  CREATED: 'Created',
  DELETED: 'Deleted',
  DELEGATES: 'Delegates',
  FUNDS: 'Funds',
  FUNDED_BY: 'Funded by',
  WITHDRAWAL: 'Withdrawal',
  REWARD: 'Reward',
  FUNDING_POOL_REMOVED: 'Funding pool removed',
})

const ACTION_VALUE_RENDERER = {
  CREATED: ({value: {depositAmount}}) => <AdaValue value={depositAmount} showCurrency />,
  DELETED: ({value: {refundAmount}}) => <AdaValue value={refundAmount} showCurrency />,
  DELEGATES: ({value: {poolName, poolHash}}) => `${poolName} ${poolHash}`,
  FUNDS: ({value: {poolName, poolHash}}) => `${poolName} ${poolHash}`,
  FUNDED_BY: ({value: {poolName, poolHash}}) => `${poolName} ${poolHash}`,
  WITHDRAWAL: ({value: {inputAmount}}) => <AdaValue value={inputAmount} showCurrency />,
  REWARD: ({value: {rewardAmount}}) => <AdaValue value={rewardAmount} showCurrency />,
  FUNDING_POOL_REMOVED: ({value: {poolName, poolHash}}) => `${poolName} ${poolHash}`,
}

const TransactionsTab = ({transactions}) => {
  const {Row, Label, Value} = SummaryCard
  const {translate: tr, formatInt, formatTimestamp} = useI18n()
  const classes = useStyles()
  return (
    <div>
      {transactions &&
        transactions.map((tx) => {
          const ActionValue = ACTION_VALUE_RENDERER[tx.action.type]
          return (
            <TransactionCard key={tx.txHash} txHash={tx.txHash}>
              <Row>
                <Label>{tr(transactionMessages.epoch)}</Label>
                <Value>{formatInt(tx.epochNumber)}</Value>
              </Row>
              <Row>
                <Label>{tr(transactionMessages.slot)}</Label>
                <Value>{formatInt(tx.slot)}</Value>
              </Row>
              <Row>
                <Label>{tr(transactionMessages.date)}</Label>
                <Value>{formatTimestamp(tx.date)}</Value>
              </Row>
              <Row>
                <Label>{tr(transactionMessages.action)}</Label>
                <Value>{tr(actionMessages[tx.action.type])}</Value>
              </Row>
              <Row>
                <Label>{tr(transactionMessages.actionValue)}</Label>
                <Value>
                  <ActionValue value={tx.action.value} />
                </Value>
              </Row>
            </TransactionCard>
          )
        })}
      <div className={classes.paginationWrapper}>
        <Pagination count={1} rowsPerPage={1} page={0} />
      </div>
    </div>
  )
}

export default TransactionsTab
