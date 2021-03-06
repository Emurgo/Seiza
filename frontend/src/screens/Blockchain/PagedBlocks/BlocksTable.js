// @flow
import React from 'react'
import {defineMessages} from 'react-intl'
import {Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {Tooltip} from '@/components/visual'
import Table, {ROW_TYPE} from '@/components/common/Table'
import {AdaValue, Link} from '@/components/common'
import {useI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'

import {ReactComponent as EpochIcon} from '@/static/assets/icons/epoch.svg'
import {ReactComponent as SlotIcon} from '@/static/assets/icons/slot.svg'
import {ReactComponent as TimeIcon} from '@/static/assets/icons/time.svg'
import {ReactComponent as SlotLeaderIcon} from '@/static/assets/icons/slot-leader.svg'
import {ReactComponent as TransactionsIcon} from '@/static/assets/icons/transactions.svg'
import {ReactComponent as TotalSentIcon} from '@/static/assets/icons/total-sent.svg'
import {ReactComponent as FeeIcon} from '@/static/assets/icons/fee.svg'
import {ReactComponent as SizeIcon} from '@/static/assets/icons/size.svg'
import type {Block} from '@/__generated__/schema.flow'

// TODO?: aria-label messages
const tableMessages = defineMessages({
  epoch: 'Epoch',
  slot: 'Slot',
  slotLeader: 'Slot leader',
  time: 'Time',
  txs: 'Txs',
  transactions: 'Transactions',
  totalSent: 'Total sent (ADA)',
  fees: 'Fees (ADA)',
  size: 'Size (B)',
  pageSeparator: 'Page {page}',
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

const SHOW_ICON_WIDTH = 1470

const useTHStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing(0.5),
    display: 'inline-block',
    height: '100%',
    verticalAlign: 'middle',
    [`@media(max-width: ${SHOW_ICON_WIDTH}px)`]: {
      display: 'none',
    },
  },
  content: {
    textAlign: 'center',
  },
  label: {
    display: 'inline-block',
  },
}))

const TH = ({Icon, label}) => {
  const classes = useTHStyles()

  return (
    <React.Fragment>
      <span className={classes.icon}>
        <Icon alt="" />
      </span>
      <Typography className={classes.label} color="textSecondary" variant="overline">
        {label}
      </Typography>
    </React.Fragment>
  )
}

type Props = {
  blocks: ?$ReadOnlyArray<Block>,
  columns: any,
  loading: boolean,
  error: any,
  nextPageNumber: number | null,
  pageBoundary: number | null,
}

const Shorthand = ({shorthand, full}) =>
  shorthand !== full ? (
    <Tooltip title={full} placement="top">
      <span style={{borderBottom: '1px dotted gray'}}>{shorthand}</span>
    </Tooltip>
  ) : (
    full
  )

const BlocksTable = ({blocks, columns, loading, error, nextPageNumber, pageBoundary}: Props) => {
  const {formatInt, formatTimestamp, translate: tr} = useI18n()

  const {EPOCH, SLOT, TIME, SLOT_LEADER, TRANSACTIONS, TOTAL_SENT, FEES, SIZE} = COLUMNS_MAP

  const columnsRenderer = {
    [EPOCH]: {
      header: {
        icon: EpochIcon,
        label: tr(tableMessages.epoch),
      },
      cell: (block) => (
        <Link key={0} to={routeTo.epoch(block.epoch)}>
          {formatInt(block.epoch)}
        </Link>
      ),
      align: 'left',
    },
    [SLOT]: {
      header: {
        icon: SlotIcon,
        label: tr(tableMessages.slot),
      },
      cell: (block) => <Link to={routeTo.block(block.blockHash)}>{formatInt(block.slot)}</Link>,
      align: 'left',
    },
    [TIME]: {
      header: {
        icon: TimeIcon,
        label: tr(tableMessages.time),
      },
      cell: (block) => (
        <Link to={routeTo.block(block.blockHash)}>{formatTimestamp(block.timeIssued)}</Link>
      ),
      align: 'left',
    },
    [SLOT_LEADER]: {
      header: {
        icon: SlotLeaderIcon,
        label: tr(tableMessages.slotLeader),
      },
      cell: (block) => (
        <Link key={3} to={routeTo.stakepool(block.blockLeader.poolHash)}>
          {block.blockLeader.name}
        </Link>
      ),
      align: 'left',
    },
    [TRANSACTIONS]: {
      header: {
        icon: TransactionsIcon,
        label: (
          <Shorthand shorthand={tr(tableMessages.txs)} full={tr(tableMessages.transactions)} />
        ),
      },
      cell: (block) => formatInt(block.transactionsCount),
      align: 'left',
    },
    [TOTAL_SENT]: {
      header: {
        icon: TotalSentIcon,
        label: tr(tableMessages.totalSent),
      },
      cell: (block) => <AdaValue key={5} value={block.totalSent} timestamp={block.timeIssued} />,
      align: 'right',
    },
    [FEES]: {
      header: {
        icon: FeeIcon,
        label: tr(tableMessages.fees),
      },
      cell: (block) => <AdaValue key={6} value={block.totalFees} timestamp={block.timeIssued} />,
      align: 'right',
    },
    [SIZE]: {
      header: {
        icon: SizeIcon,
        label: tr(tableMessages.size),
      },
      cell: (block) => formatInt(block.size),
      align: 'right',
    },
  }

  const pageSeparator = {
    type: ROW_TYPE.SEPARATOR,
    text: tr(tableMessages.pageSeparator, {page: nextPageNumber}),
  }

  const fields = columns.map((column) => columnsRenderer[column])

  const headerData = fields.map(({header}, i) => (
    <TH key={i} Icon={header.icon} label={header.label} />
  ))

  const fieldsConfig = fields.map(({align, thAlign}) => ({
    align: align || 'left',
    thAlign: thAlign || align || 'left',
  }))

  const rows = (blocks || []).map((block) => ({
    type: ROW_TYPE.DATA,
    data: columns.map((column) => columnsRenderer[column].cell(block)),
  }))

  // Note: mutates rows
  if (pageBoundary != null) {
    rows.splice(pageBoundary, 0, pageSeparator)
  }

  return <Table hoverable {...{loading, error, headerData, bodyData: rows, fieldsConfig}} />
}

export default BlocksTable
