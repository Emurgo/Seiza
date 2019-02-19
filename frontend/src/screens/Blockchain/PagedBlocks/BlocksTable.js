// @flow
import React from 'react'
import {compose} from 'redux'
import {defineMessages} from 'react-intl'
import {Link} from 'react-router-dom'
import {withStyles} from '@material-ui/core'

import PaginatedTable from '../../../components/visual/PaginatedTable'
import {withI18n} from '../../../i18n/helpers'
import {withProps} from 'recompose'

const I18N_PREFIX = 'blockchain.blockList.table'

// TODO?: aria-label messages
const tableMessages = defineMessages({
  epoch: {
    id: `${I18N_PREFIX}.epoch`,
    defaultMessage: 'epoch',
  },
  slot: {
    id: `${I18N_PREFIX}.slot`,
    defaultMessage: 'slot',
  },
  slotLeader: {
    id: `${I18N_PREFIX}.slotLeader`,
    defaultMessage: 'slot leader',
  },
  time: {
    id: `${I18N_PREFIX}.time`,
    defaultMessage: 'time',
  },
  transactions: {
    id: `${I18N_PREFIX}.transactions`,
    defaultMessage: 'transactions',
  },
  totalSent: {
    id: `${I18N_PREFIX}.totalSent`,
    defaultMessage: 'total sent (ADA)',
  },
  fees: {
    id: `${I18N_PREFIX}.fees`,
    defaultMessage: 'fees (ADA)',
  },
  size: {
    id: `${I18N_PREFIX}.size`,
    defaultMessage: 'size (B)',
  },
})

const linkFieldStyles = (theme) => ({
  linkField: {
    color: theme.palette.primary.dark,
  },
})

const LinkField = withStyles(linkFieldStyles)(({children, to, classes}) => (
  <Link to={to} className={classes.linkField}>
    {children}
  </Link>
))

const BlocksTable = (props) => (
  <PaginatedTable
    rowsPerPage={props.rowsPerPage}
    page={props.page}
    totalCount={props.totalCount}
    onChangePage={props.onChangePage}
    rowsPerPageOptions={[props.rowsPerPage]}
    bodyData={props.bodyData}
    headerData={props.headerData}
  />
)

export default compose(
  withI18n,
  withProps(({blocks, i18n}) => {
    const {translate, formatInt, formatAda, formatTimestamp} = i18n

    const headerData = [
      translate(tableMessages.epoch),
      translate(tableMessages.slot),
      translate(tableMessages.slotLeader),
      translate(tableMessages.time),
      translate(tableMessages.transactions),
      translate(tableMessages.totalSent),
      translate(tableMessages.fees),
      translate(tableMessages.size),
    ]

    const bodyData = blocks.map((block, index) => (
      [
        <LinkField key={0} to="/todo">{formatInt(block.epoch)}</LinkField>,
        <LinkField key={1} to="/todo">{formatInt(block.slot)}</LinkField>,
        <LinkField key={2} to="/todo">{block.blockLead}</LinkField>,
        formatTimestamp(block.timeIssued),
        formatInt(block.transactionsCount),
        formatAda(block.totalSend),
        formatAda(block.totalFees),
        formatInt(block.size),
      ]
    ))
    return {headerData, bodyData}
  })
)(BlocksTable)
