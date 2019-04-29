// @flow
import React from 'react'
import {defineMessages} from 'react-intl'
import {makeStyles} from '@material-ui/styles'

import Table from '@/components/visual/Table'
import {AdaValue, Link, Tooltip} from '@/components/visual'
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
  epoch: 'Epoch',
  slot: 'Slot',
  slotLeader: 'Slot leader',
  time: 'Time',
  txs: 'Txs',
  transactions: 'Transactions',
  totalSent: 'Total sent (ADA)',
  fees: 'Fees (ADA)',
  size: 'Size (B)',
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

// Width under which icon moves to the top
const ICON_TOP_WIDTH = 1470

const useTHStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: '0px',
    display: 'inline-block',
    height: '100%',
    verticalAlign: 'middle',
    [`@media(mid-width: ${ICON_TOP_WIDTH}px)`]: {
      marginRight: 6,
    },
    [theme.breakpoints.down('sm')]: {
      marginRight: 6,
    },
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  content: {
    textAlign: 'center',
  },
  br: {
    [`@media(min-width: ${ICON_TOP_WIDTH}px)`]: {
      display: 'none',
    },
    // We switch to mobile layout when <= sm
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}))

const TH = ({Icon, label}) => {
  const classes = useTHStyles()

  return (
    <React.Fragment>
      <div className={classes.icon}>
        <Icon alt="" />
      </div>
      <br className={classes.br} />
      <span>{label}</span>
    </React.Fragment>
  )
}

type Props = {
  blocks: ?$ReadOnlyArray<Block>,
  columns: any,
  loading: boolean,
  error: any,
}

const BlocksTable = ({blocks, columns, loading, error}: Props) => {
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
      align: 'center',
    },
    [SLOT]: {
      header: {
        icon: SlotIcon,
        label: tr(tableMessages.slot),
      },
      cell: (block) => (
        <Link key={1} to={routeTo.block(block.blockHash)}>
          {formatInt(block.slot)}
        </Link>
      ),
      align: 'center',
    },
    [TIME]: {
      header: {
        icon: TimeIcon,
        label: tr(tableMessages.time),
      },
      cell: (block) => formatTimestamp(block.timeIssued),
      thAlign: 'center',
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
      thAlign: 'center',
    },
    [TRANSACTIONS]: {
      header: {
        icon: TransactionsIcon,
        label: (
          <Tooltip title={tr(tableMessages.transactions)} placement="top">
            <span style={{borderBottom: '1px dotted gray'}}>{tr(tableMessages.txs)}</span>
          </Tooltip>
        ),
      },
      cell: (block) => formatInt(block.transactionsCount),
      align: 'center',
    },
    [TOTAL_SENT]: {
      header: {
        icon: TotalSentIcon,
        label: tr(tableMessages.totalSent),
      },
      cell: (block) => <AdaValue key={5} value={block.totalSent} />,
      align: 'right',
    },
    [FEES]: {
      header: {
        icon: FeeIcon,
        label: tr(tableMessages.fees),
      },
      cell: (block) => <AdaValue key={6} value={block.totalFees} />,
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

  const fields = columns.map((column) => columnsRenderer[column])

  const headerData = fields.map(({header}, i) => (
    <TH key={i} Icon={header.icon} label={header.label} />
  ))

  const fieldsConfig = fields.map(({align, thAlign}) => ({
    align: align || 'left',
    thAlign: thAlign || align || 'left',
  }))

  const bodyData = blocks ? blocks.map((block, index) => fields.map(({cell}) => cell(block))) : []

  return <Table hoverable {...{loading, error, headerData, bodyData, fieldsConfig}} />
}

export default BlocksTable
