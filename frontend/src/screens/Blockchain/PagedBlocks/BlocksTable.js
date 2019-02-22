// @flow
import React from 'react'
import {compose} from 'redux'
import {defineMessages} from 'react-intl'
import {Link as RouterLink} from 'react-router-dom'
import {Link as MuiLink} from '@material-ui/core'

import Table from '@/components/visual/Table'
import {withI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'
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

const Link = ({to, children}) => (
  <MuiLink component={RouterLink} to={to}>
    {children}
  </MuiLink>
)

const BlocksTable = (props) => <Table bodyData={props.bodyData} headerData={props.headerData} />

export default compose(
  withI18n,
  withProps(({blocks, i18n}) => {
    const {translate, formatInt, formatAda, formatTimestamp} = i18n

    const headerData = [
      translate(tableMessages.epoch),
      translate(tableMessages.slot),
      translate(tableMessages.time),
      translate(tableMessages.slotLeader),
      translate(tableMessages.transactions),
      translate(tableMessages.totalSent),
      translate(tableMessages.fees),
      translate(tableMessages.size),
    ]

    const bodyData = blocks.map((block, index) => [
      <Link key={0} to="/todo">
        {formatInt(block.epoch)}
      </Link>,
      <Link key={1} to={routeTo.block(block.blockHash)}>
        {formatInt(block.slot)}
      </Link>,
      formatTimestamp(block.timeIssued),
      <Link key={2} to="/todo">
        {block.blockLead}
      </Link>,
      formatInt(block.transactionsCount),
      formatAda(block.totalSend),
      formatAda(block.totalFees),
      formatInt(block.size),
    ])
    return {headerData, bodyData}
  })
)(BlocksTable)
