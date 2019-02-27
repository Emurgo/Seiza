// @flow
import React from 'react'
import {defineMessages} from 'react-intl'
import {Link as RouterLink} from 'react-router-dom'
import {Link as MuiLink} from '@material-ui/core'

import Table from '@/components/visual/Table'
import AdaValue from '@/components/visual/AdaValue'
import {withI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'

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

export const COLUMNS_MAP = {
  EPOCH: 'EPOCH',
  SLOT: 'SLOT',
  TIME: 'TIME',
  SLOT_LEADER: 'SLOT_LEADER',
  TRANSACTIONS: 'TRANSACTIONS',
  TOTAL_SENT: 'TOTAL_SENT',
  FEES: 'FEES',
  SIZE: 'SIZE',
}
export const ALL_COLUMNS = Object.values(COLUMNS_MAP)

const BlocksTable = ({blocks, columns, i18n}) => {
  const {translate, formatInt, formatTimestamp} = i18n

  const {EPOCH, SLOT, TIME, SLOT_LEADER, TRANSACTIONS, TOTAL_SENT, FEES, SIZE} = COLUMNS_MAP
  const columnsRenderer = {
    [EPOCH]: {
      header: translate(tableMessages.epoch),
      cell: (block) => (
        <Link key={0} to="/todo">
          {formatInt(block.epoch)}
        </Link>
      ),
    },
    [SLOT]: {
      header: translate(tableMessages.slot),
      cell: (block) => (
        <Link key={1} to={routeTo.block(block.blockHash)}>
          {formatInt(block.slot)}
        </Link>
      ),
    },
    [TIME]: {
      header: translate(tableMessages.time),
      cell: (block) => formatTimestamp(block.timeIssued),
    },
    [SLOT_LEADER]: {
      header: translate(tableMessages.slotLeader),
      cell: (block) => (
        <Link key={3} to={routeTo.stakepool(block.blockLeader.poolHash)}>
          {block.blockLeader.name}
        </Link>
      ),
    },
    [TRANSACTIONS]: {
      header: translate(tableMessages.transactions),
      cell: (block) => formatInt(block.transactionsCount),
    },
    [TOTAL_SENT]: {
      header: translate(tableMessages.totalSent),
      cell: (block) => (
        <FixWidth key={5} width={100}>
          <AdaValue value={block.totalSend} />
        </FixWidth>
      ),
    },
    [FEES]: {
      header: translate(tableMessages.fees),
      cell: (block) => (
        <FixWidth key={6} width={100}>
          <AdaValue value={block.totalFees} />
        </FixWidth>
      ),
    },
    [SIZE]: {
      header: translate(tableMessages.size),
      cell: (block) => formatInt(block.size),
    },
  }
  // Hotfix before we support proper table column formatting
  const FixWidth = ({width, children}) => <div style={{width, textAlign: 'right'}}>{children}</div>

  const headerData = columns.map((column) => columnsRenderer[column].header)
  const bodyData = blocks.map((block, index) =>
    columns.map((column) => columnsRenderer[column].cell(block))
  )

  return <Table bodyData={bodyData} headerData={headerData} />
}

export default withI18n(BlocksTable)
