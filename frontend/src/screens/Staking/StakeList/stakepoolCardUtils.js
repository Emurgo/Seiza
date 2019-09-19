// @flow
import _ from 'lodash'
import React, {useMemo} from 'react'
import {Typography, Hidden, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {AdaValue, HelpTooltip} from '@/components/common'
import {ExpandableCardFooter, Tooltip, SimpleExpandableCard, Card} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import EstimatedRewardsValue from './EstimatedRewards'
import type {Formatters} from '@/i18n/helpers'
import type {EstimatedRewardsType} from './EstimatedRewards'

const messages = defineMessages({
  performance: 'Performance:',
  pledge: 'Pledge:',
  margins: 'Margins:',
  fee: 'Fee:',
  fullness: 'Fullness:',
  createdAt: 'Created:',
  stake: 'Stake:',
  rewards: 'Rewards:',
  feeAndMargin: 'Cost + Fee:',
  // Note(bigamasta): If needed to be reused on Stake pools screens,
  // we can create something like helpers/helpMessages.js
  performanceHelpText: 'TODO: Performance Help Text',
  pledgeHelpText: 'TODO: Pledge Help Text',
  marginsHelpText: 'TODO: Margins Help Text',
  feeHelpText: 'TODO: Fee Help Text',
  fullnessHelpText: 'TODO: Fullness Help Text',
  createdAtHelpText: 'TODO: CreatedAt Help Text',
  stakeHelpText: 'TODO: Stake Help Text',
  rewardsHelpText: 'TODO: Rewards Help Text',
  feeAndMarginHelpText: 'TODO: Cost and Fee Help Text',
})

const footerMessages = defineMessages({
  hideDetails: 'Hide details',
  showDetails: 'Show details',
})

const ageMessages = defineMessages({
  ageLabel: 'Age:',
  ageValue: '{epochCount, plural, =0 {# epochs} one {# epoch} other {# epochs}}',
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
  simpleGridWrapper: {
    paddingTop: theme.spacing(1),
  },
  feeAndMarginWrapper: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'flex-end',
    },
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

const SimpleDesktopGrid = ({leftItem, rightItem}) => {
  const classes = useStyles()
  return (
    <Grid container className={classes.simpleGridWrapper}>
      <Grid item xs={4}>
        <Grid container justify="flex-start">
          <DataGridLabel>{leftItem.label}</DataGridLabel>
          {leftItem.value}
        </Grid>
      </Grid>
      <Grid item xs={8}>
        <Grid container justify="flex-end">
          <DataGridLabel>{rightItem.label}</DataGridLabel>
          {rightItem.value}
        </Grid>
      </Grid>
    </Grid>
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

type Item = {|
  label: React$Node,
  value: React$Node,
|}

type Items = Array<Item>

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

const EMPTY_ARRAY = []

type SimpleDataGridProps = {|
  leftItem: Item,
  rightItem: Item,
|}

// Note: there are exactly two items hardcoded for simplicity, as it is hard to create
// good abstraction till we do not know how the layout may change
export const SimpleDataGrid = ({leftItem, rightItem}: SimpleDataGridProps) => {
  const mobileGridItems = useMemo(() => [leftItem, rightItem], [leftItem, rightItem])
  return (
    <React.Fragment>
      <Hidden lgUp>
        <MobileGrid leftSideItems={mobileGridItems} rightSideItems={EMPTY_ARRAY} />
      </Hidden>
      <Hidden mdDown>
        <SimpleDesktopGrid {...{leftItem, rightItem}} />
      </Hidden>
    </React.Fragment>
  )
}

type FieldProps = {|
  formatters: Formatters,
  data: {
    performance: number,
    fee: string,
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

// TODO: type
const FeeAndMargin = ({data, formatPercent}: any) => {
  const classes = useStyles()
  return (
    <div className={classes.feeAndMarginWrapper}>
      <AdaValue showCurrency value={data.fee} />
      &nbsp;+&nbsp;
      <Typography>{formatPercent(data.margins)}</Typography>
    </div>
  )
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
  fee: {
    label: <HelpTooltip text={tr(messages.feeHelpText)}>{tr(messages.fee)}</HelpTooltip>,
    value: <AdaValue showCurrency value={data.fee} />,
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
      <Tooltip
        title={formatTimestamp(data.createdAt, {
          format: formatTimestamp.FMT_MONTH_NUMERAL,
        })}
        placement="bottom-start"
      >
        <Typography>
          {formatTimestamp(data.createdAt, {format: formatTimestamp.FMT_SHORT_DATE})}
        </Typography>
      </Tooltip>
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
  feeAndMargin: {
    label: (
      <HelpTooltip text={tr(messages.feeAndMarginHelpText)}>
        {tr(messages.feeAndMargin)}
      </HelpTooltip>
    ),
    value: <FeeAndMargin {...{formatPercent, data}} />,
  },
})

const usePoolFooterStyles = makeStyles((theme) => ({
  wrapper: {
    position: 'relative',
    padding: theme.spacing(1.5),
  },
  mobileFooterIcon: {
    padding: theme.spacing(0.75),
  },
  showDetailsWrapper: {
    marginRight: -theme.spacing(0.5),
  },
}))

export const MobilePoolFooter = ({
  rightSide,
  expanded,
}: {
  rightSide: React$Node,
  expanded: boolean,
}) => {
  const {translate: tr} = useI18n()
  const classes = usePoolFooterStyles()
  const label = tr(expanded ? footerMessages.hideDetails : footerMessages.showDetails)

  return (
    <Grid
      container
      alignItems="center"
      justify="space-between"
      wrap="nowrap"
      className={classes.wrapper}
    >
      {rightSide}
      <div className={classes.showDetailsWrapper}>
        <Hidden smUp>
          <ExpandableCardFooter
            expanded={expanded}
            label=""
            iconClassName={classes.mobileFooterIcon}
          />
        </Hidden>
        <Hidden xsDown>
          <ExpandableCardFooter
            iconClassName={classes.mobileFooterIcon}
            expanded={expanded}
            label={label}
          />
        </Hidden>
      </div>
    </Grid>
  )
}

const useStakepoolMobileCardClasses = makeStyles((theme) => ({
  wrapper: {
    // We should set `expanded` class, but for some reason it is not working
    padding: '0 !important',
    margin: '0 !important',
    width: '100%', // Needed for proper ellipsize,
    borderRadius: '0 !important',
    boxShadow: 'unset',
  },
}))

type StakepoolMobileCardProps = {|
  expanded: boolean,
  onChange: Function,
  renderExpandedArea: Function,
  renderHeader: Function,
  nonExpandableHeader: React$Node,
|}

export const StakepoolMobileCard = ({
  expanded,
  onChange,
  renderExpandedArea,
  renderHeader,
  nonExpandableHeader,
}: StakepoolMobileCardProps) => {
  const classes = useStakepoolMobileCardClasses()

  const commonClasses = useMemo(() => ({root: classes.wrapper}), [classes])
  const headerClasses = useMemo(() => ({root: classes.wrapper, content: classes.wrapper}), [
    classes,
  ])

  return (
    <Card>
      {nonExpandableHeader}
      <SimpleExpandableCard
        {...{expanded, onChange, renderExpandedArea, renderHeader}}
        hideDefaultIcon
        headerClasses={headerClasses}
        detailsClasses={commonClasses}
        cardClasses={commonClasses}
      />
    </Card>
  )
}

export const useCommonContentStyles: any = makeStyles(({palette, spacing, breakpoints}) => ({
  innerWrapper: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'column',
    padding: `${spacing(3)}px ${spacing(1.5)}px`,
    paddingTop: spacing(1),
    [breakpoints.up('md')]: {
      padding: spacing(3),
      paddingTop: spacing(1),
    },
    [breakpoints.up('lg')]: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
  revenueWrapper: {
    minWidth: 90,
    marginRight: spacing(2),
    display: 'flex',
    height: '100%',
    alignItems: 'center',
  },
}))

type AgeProps = {|
  +epochCount: number,
|}

const useAgeClasses = makeStyles((theme) => ({
  ageWrapper: {
    'paddingTop': theme.spacing(1),
    '& > *': {
      paddingRight: theme.spacing(1),
    },
  },
}))

export const Age = ({epochCount}: AgeProps) => {
  const {translate: tr} = useI18n()
  const classes = useAgeClasses()
  return (
    <Grid container alignItems="center" className={classes.ageWrapper}>
      <img alt="" src="/static/assets/icons/epoch.svg" />
      <Typography component="span" variant="overline" color="textSecondary">
        {tr(ageMessages.ageLabel)}
      </Typography>
      <Typography component="span" variant="overline">
        {tr(ageMessages.ageValue, {epochCount})}
      </Typography>
    </Grid>
  )
}
