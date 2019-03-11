// @flow
import React from 'react'
import {defineMessages} from 'react-intl'

import Table from '@/components/visual/Table'
import {AdaValue, Link} from '@/components/visual'
import {withI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'

const I18N_PREFIX = 'blockchain.blockList.table'

// TODO?: aria-label messages
const tableMessages = defineMessages({
  epoch: 'epoch',
  slot: 'slot',
  slotLeader: 'slot leader',
  time: 'time',
  transactions: 'transactions',
  totalSent: 'total sent (ADA)',
  fees: 'fees (ADA)',
  size: 'size (B)',
  noDataToShow: 'No data to show.',
})

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

const BlocksTable = ({blocks, columns, i18n, loading, error}) => {
  const {translate, formatInt, formatTimestamp} = i18n

  const {EPOCH, SLOT, TIME, SLOT_LEADER, TRANSACTIONS, TOTAL_SENT, FEES, SIZE} = COLUMNS_MAP
  const columnsRenderer = {
    [EPOCH]: {
      header: translate(tableMessages.epoch),
      cell: (block) => (
        <Link key={0} to={routeTo.epoch(block.epoch)}>
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

  const bodyData =
    blocks &&
    blocks.map((block, index) => columns.map((column) => columnsRenderer[column].cell(block)))

  return (
    <Table
      noDataText={translate(tableMessages.noDataToShow)}
      loading={loading}
      error={error}
      headerData={headerData}
      bodyData={bodyData}
    />
  )
}

export default withI18n(BlocksTable)
