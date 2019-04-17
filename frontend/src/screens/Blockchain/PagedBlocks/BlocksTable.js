// @flow
import React from 'react'
import {defineMessages} from 'react-intl'
import {makeStyles} from '@material-ui/styles'
import {Grid} from '@material-ui/core'

import Table from '@/components/visual/Table'
import {AdaValue, Link} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'

import {ReactComponent as EpochIcon} from '@/assets/icons/epoch.svg'
import {ReactComponent as SlotIcon} from '@/assets/icons/slot.svg'
import {ReactComponent as TimeIcon} from '@/assets/icons/time.svg'
import {ReactComponent as SlotLeaderIcon} from '@/assets/icons/slot-leader.svg'
import {ReactComponent as TransactionsIcon} from '@/assets/icons/transactions.svg'
import {ReactComponent as TotalSentIcon} from '@/assets/icons/total-sent.svg'
import {ReactComponent as FeeIcon} from '@/assets/icons/fee.svg'
import {ReactComponent as SizeIcon} from '@/assets/icons/size.svg'

import type {Block} from '@/__generated__/schema.flow'

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

const useTHStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: '20px',
    height: '20px',
    flexShrink: 0,
  },
  content: {
    marginLeft: '6px',
  },
}))

const TH = ({Icon, label}) => {
  const {translate} = useI18n()
  const classes = useTHStyles()
  return (
    <Grid container direction="row" alignItems="center" wrap="nowrap">
      <Icon />
      <span className={classes.content}>{translate(label)}</span>
    </Grid>
  )
}

type Props = {
  blocks: ?$ReadOnlyArray<Block>,
  columns: any,
  loading: boolean,
  error: any,
}

const BlocksTable = ({blocks, columns, loading, error}: Props) => {
  const {formatInt, formatTimestamp} = useI18n()

  const {EPOCH, SLOT, TIME, SLOT_LEADER, TRANSACTIONS, TOTAL_SENT, FEES, SIZE} = COLUMNS_MAP

  const columnsRenderer = {
    [EPOCH]: {
      header: <TH Icon={EpochIcon} label={tableMessages.epoch} />,
      cell: (block) => (
        <Link key={0} to={routeTo.epoch(block.epoch)}>
          {formatInt(block.epoch)}
        </Link>
      ),
    },
    [SLOT]: {
      header: <TH Icon={SlotIcon} label={tableMessages.slot} />,
      cell: (block) => (
        <Link key={1} to={routeTo.block(block.blockHash)}>
          {formatInt(block.slot)}
        </Link>
      ),
    },
    [TIME]: {
      header: <TH Icon={TimeIcon} label={tableMessages.time} />,
      cell: (block) => formatTimestamp(block.timeIssued),
    },
    [SLOT_LEADER]: {
      header: <TH Icon={SlotLeaderIcon} label={tableMessages.slotLeader} />,
      cell: (block) => (
        <Link key={3} to={routeTo.stakepool(block.blockLeader.poolHash)}>
          {block.blockLeader.name}
        </Link>
      ),
    },
    [TRANSACTIONS]: {
      header: <TH Icon={TransactionsIcon} label={tableMessages.transactions} />,
      cell: (block) => formatInt(block.transactionsCount),
    },
    [TOTAL_SENT]: {
      header: <TH Icon={TotalSentIcon} label={tableMessages.totalSent} />,
      cell: (block) => (
        <FixWidth key={5} width={100}>
          <AdaValue value={block.totalSent} />
        </FixWidth>
      ),
    },
    [FEES]: {
      header: <TH Icon={FeeIcon} label={tableMessages.fees} />,
      cell: (block) => (
        <FixWidth key={6} width={100}>
          <AdaValue value={block.totalFees} />
        </FixWidth>
      ),
    },
    [SIZE]: {
      header: <TH Icon={SizeIcon} label={tableMessages.size} />,
      cell: (block) => formatInt(block.size),
    },
  }
  // Hotfix before we support proper table column formatting
  const FixWidth = ({width, children}) => <div style={{width, textAlign: 'right'}}>{children}</div>

  const headerData = columns.map((column) => columnsRenderer[column].header)

  const bodyData = blocks
    ? blocks.map((block, index) => columns.map((column) => columnsRenderer[column].cell(block)))
    : []

  return (
    <Table hoverable loading={loading} error={error} headerData={headerData} bodyData={bodyData} />
  )
}

export default BlocksTable
