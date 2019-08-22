// @flow
import _ from 'lodash'
import React from 'react'
import {Typography, Hidden} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {AdaValue, HelpTooltip} from '@/components/common'
import EstimatedRewardsValue from './EstimatedRewards'
import type {Formatters} from '@/i18n/helpers'
import type {EstimatedRewardsType} from './EstimatedRewards'

const messages = defineMessages({
  performance: 'Performance:',
  pledge: 'Pledge:',
  margins: 'Margins:',
  cost: 'Cost:',
  fullness: 'Fullness:',
  createdAt: 'Created:',
  stake: 'Stake:',
  rewards: 'Rewards:',
  // Note(bigamasta): If needed to be reused on Stake pools screens,
  // we can create something like helpers/helpMessages.js
  performanceHelpText: 'TODO: Performance Help Text',
  pledgeHelpText: 'TODO: Pledge Help Text',
  marginsHelpText: 'TODO: Margins Help Text',
  costHelpText: 'TODO: Cost Help Text',
  fullnessHelpText: 'TODO: Fullness Help Text',
  createdAtHelpText: 'TODO: CreatedAt Help Text',
  stakeHelpText: 'TODO: Stake Help Text',
  rewardsHelpText: 'TODO: Rewards Help Text',
})

const useStyles = makeStyles((theme) => ({
  label: {
    color: theme.palette.grey[500], // TODO: make fit any theme
    textTransform: 'uppercase',
    paddingRight: theme.spacing(2),
  },
  td: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  xsTdDown: {
    paddingBottom: theme.spacing(1),
  },
  adaField: {
    minWidth: 0,
    [theme.breakpoints.up('sm')]: {
      minWidth: 150,
    },
  },
  emptyCol: {
    width: '50%',
  },
}))

export const CARD_WIDTH = '900px'

const DataGridLabel = ({children}) => {
  const classes = useStyles()
  return <Typography className={classes.label}>{children}</Typography>
}

const DesktopGridLabelValue = ({align, label, value}) => {
  const classes = useStyles()
  return (
    <React.Fragment>
      <td className={classes.td}>
        <DataGridLabel>{label}</DataGridLabel>
      </td>
      <td align={align} className={classes.td}>
        {value}
      </td>
    </React.Fragment>
  )
}

const DesktopGrid = ({leftSideItems, rightSideItems}) => {
  const classes = useStyles()
  return (
    <table className="w-100">
      <tbody>
        {_.zip(leftSideItems, rightSideItems).map(([_l, _r], index) => {
          const l = _l || {label: '', value: ''}
          const r = _r || {label: '', value: ''}
          return (
            <tr key={index}>
              <DesktopGridLabelValue value={l.value} label={l.label} align="left" />
              <td className={classes.emptyCol} />
              <DesktopGridLabelValue value={r.value} label={r.label} align="left" />
              <td className={classes.emptyCol} />
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const MobileGrid = ({leftSideItems, rightSideItems}) => {
  const classes = useStyles()
  const items = [...leftSideItems, ...rightSideItems]

  return (
    <table className="w-100">
      <tbody>
        <Hidden xsDown>
          {items.map(({value, label}, index) => (
            <tr key={index}>
              <td className={classes.td}>
                <DataGridLabel>{label}</DataGridLabel>
              </td>
              <td className={classes.td} align="right">
                {value}
              </td>
            </tr>
          ))}
        </Hidden>
        <Hidden smUp>
          {items.map(({value, label}, index) => (
            <React.Fragment key={index}>
              <tr>
                <td>
                  <DataGridLabel>{label}</DataGridLabel>
                </td>
              </tr>
              <tr>
                <td className={classes.xsTdDown}>{value}</td>
              </tr>
            </React.Fragment>
          ))}
        </Hidden>
      </tbody>
    </table>
  )
}

type Items = Array<{label: React$Node, value: React$Node}>

// TODO: consider rendering only client side and using conditions instead of Hidden
export const DataGrid = ({
  leftSideItems,
  rightSideItems,
}: {
  leftSideItems: Items,
  rightSideItems: Items,
}) => (
  <React.Fragment>
    <Hidden lgUp>
      <MobileGrid {...{leftSideItems, rightSideItems}} />
    </Hidden>
    <Hidden mdDown>
      <DesktopGrid {...{leftSideItems, rightSideItems}} />
    </Hidden>
  </React.Fragment>
)

type FieldProps = {|
  formatters: Formatters,
  data: {
    performance: number,
    cost: string,
    pledge: string,
    margins: number,
    fullness: number,
    createdAt: string,
    stake: string,
    estimatedRewards: EstimatedRewardsType,
  },
|}

// This is used to ensure that changing RewardsField mode, does not change columns width
// The width was estimated very ad-hoc
const MinAdaFieldWidth = ({children}: {children: React$Node}) => {
  const classes = useStyles()
  return <div className={classes.adaField}>{children}</div>
}

export const getStakepoolCardFields = ({
  formatters: {translate: tr, formatPercent, formatTimestamp},
  data,
}: FieldProps) => ({
  performance: {
    label: (
      <HelpTooltip text={tr(messages.performanceHelpText)}>{tr(messages.performance)}</HelpTooltip>
    ),
    value: <Typography>{formatPercent(data.performance)}</Typography>,
  },
  cost: {
    label: <HelpTooltip text={tr(messages.costHelpText)}>{tr(messages.cost)}</HelpTooltip>,
    value: <AdaValue showCurrency value={data.cost} />,
  },
  pledge: {
    label: <HelpTooltip text={tr(messages.pledgeHelpText)}>{tr(messages.pledge)}</HelpTooltip>,
    value: <AdaValue showCurrency value={data.pledge} />,
  },
  margins: {
    label: <HelpTooltip text={tr(messages.marginsHelpText)}>{tr(messages.margins)}</HelpTooltip>,
    value: <Typography>{formatPercent(data.margins)}</Typography>,
  },
  fullness: {
    label: <HelpTooltip text={tr(messages.fullnessHelpText)}>{tr(messages.fullness)}</HelpTooltip>,
    value: <Typography>{formatPercent(data.fullness)}</Typography>,
  },
  createdAt: {
    label: (
      <HelpTooltip text={tr(messages.createdAtHelpText)}>{tr(messages.createdAt)}</HelpTooltip>
    ),
    value: (
      <Typography>
        {/* Tooltip for date will come in another PR */}
        {formatTimestamp(data.createdAt, {format: formatTimestamp.FMT_SHORT_DATE})}
      </Typography>
    ),
  },
  stake: {
    label: <HelpTooltip text={tr(messages.stakeHelpText)}>{tr(messages.stake)}</HelpTooltip>,
    value: <AdaValue showCurrency value={data.stake} />,
  },
  estimatedRewards: {
    label: <HelpTooltip text={tr(messages.rewardsHelpText)}>{tr(messages.rewards)}</HelpTooltip>,
    value: (
      <MinAdaFieldWidth>
        <EstimatedRewardsValue estimatedRewards={data.estimatedRewards} />
      </MinAdaFieldWidth>
    ),
  },
})
