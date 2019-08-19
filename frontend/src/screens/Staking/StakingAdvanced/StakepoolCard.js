// @flow
import React, {useCallback, useMemo} from 'react'
import cn from 'classnames'
import {Grid, Typography, IconButton, Menu, MenuItem} from '@material-ui/core'
import {MoreVert} from '@material-ui/icons'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'
import {fade} from '@material-ui/core/styles/colorManipulator'

import {
  ExpandableCard,
  ExpandableCardFooter,
  Button,
  MobileOnly,
  DesktopOnly,
  Tooltip,
} from '@/components/visual'
import {
  AdaValue,
  PoolEntityContent,
  ResponsiveCircularProgressBar,
  HelpTooltip,
} from '@/components/common'
import {useUserAdaContext} from '../context/userAda'
import WithModalState from '@/components/headless/modalState'
import {useI18n} from '@/i18n/helpers'
import {useSelectedPoolsContext} from '../context/selectedPools'
import {useIsMobile, useIsBreakpointDown} from '@/components/hooks/useBreakpoints'
import {ReactComponent as AddPoolIcon} from '@/static/assets/icons/staking-simulator/add-stakepool.svg'
import {ReactComponent as RemovePoolIcon} from '@/static/assets/icons/close.svg'
import epochIcon from '@/static/assets/icons/epoch.svg'

import {ESTIMATED_REWARDS_MODES, useEstimatedRewardsMode} from './estimatedRewardsModeUtils'

const messages = defineMessages({
  revenue: 'Revenue',
  performance: 'Performance:',
  pledge: 'Pledge:',
  margins: 'Margins:',
  createdAt: 'Created:',
  fullness: 'Fullness:',
  stake: 'Stake:',
  cost: 'Cost:',
  rewards: 'Rewards:',
  hideDesc: 'Hide description',
  showDesc: 'Full description',
  hideDetails: 'Hide details',
  showDetails: 'Show details',
  addPool: 'Add',
  removePool: 'Remove',
  // Note(bigamasta): If needed to be reused on Stake pools screens,
  // we can create something like helpers/helpMessages.js
  performanceHelpText: 'TODO: Performance Help Text',
  fullnessHelpText: 'TODO: Fullness Help Text',
  marginsHelpText: 'TODO: Margins Help Text',
  createdAtHelpText: 'TODO: CreatedAt Help Text',
  pledgeHelpText: 'TODO: Pledge Help Text',
  stakeHelpText: 'TODO: Stake Help Text',
  costHelpText: 'TODO: Cost Help Text',
  rewardsHelpText: 'TODO: Rewards Help Text',
  ageLabel: 'Age:',
  ageValue: '{epochCount, plural, =0 {# epochs} one {# epoch} other {# epochs}}',
})

const useHeaderStyles = makeStyles(({palette, spacing, breakpoints}) => ({
  wrapper: {
    background: palette.background.paperContrast,
    padding: spacing(1),
    [breakpoints.up('md')]: {
      padding: spacing(3),
    },
  },
  button: {
    width: '120px',
  },
  mobileButton: {
    borderRadius: '50%',
    width: 48,
    minWidth: 48,
    height: 48,
    padding: 0,
  },
  flexEllipsize: {
    // needed for proper ellipsize in children components with flex
    minWidth: 0,
  },
}))

const useContentStyles = makeStyles(({palette, spacing, breakpoints}) => ({
  verticalBlock: {
    paddingRight: spacing(3),
  },
  label: {
    color: palette.grey[500], // TODO: make fit any theme
    textTransform: 'uppercase',
  },
  rowItem: {
    paddingTop: spacing(1),
    paddingBottom: spacing(1),
  },
  innerWrapper: {
    display: 'flex',
    padding: spacing(3),
    justifyContent: 'space-between',
    flexDirection: 'column',
    [breakpoints.up('lg')]: {
      flexDirection: 'row',
    },
  },
  extraContent: {
    padding: spacing(3),
  },
  alignRight: {
    textAlign: 'right',
  },
  revenueWrapper: {
    minWidth: 90,
    marginRight: spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  ageWrapper: {
    'paddingTop': spacing(1),
    '& > *': {
      paddingRight: spacing(1),
    },
  },
  rewardsRowWrapper: {
    position: 'relative',
    paddingRight: 52, // size of icon button
  },
}))

const AddPoolButton = ({onClick, label}) => {
  const classes = useHeaderStyles()

  return (
    <React.Fragment>
      <MobileOnly>
        <Button
          rounded
          gradient
          variant="contained"
          gradientDegree={45}
          onClick={onClick}
          className={classes.mobileButton}
        >
          <AddPoolIcon />
        </Button>
      </MobileOnly>

      <DesktopOnly>
        <Button rounded gradient variant="contained" onClick={onClick} className={classes.button}>
          {label}
        </Button>
      </DesktopOnly>
    </React.Fragment>
  )
}

const RemovePoolButton = ({onClick, label}) => {
  const classes = useHeaderStyles()

  return (
    <React.Fragment>
      <MobileOnly>
        <Button
          rounded
          gradient
          gradientDegree={45}
          variant="outlined"
          onClick={onClick}
          className={classes.mobileButton}
        >
          <RemovePoolIcon />
        </Button>
      </MobileOnly>

      <DesktopOnly>
        <Button rounded gradient variant="outlined" onClick={onClick} className={classes.button}>
          {label}
        </Button>
      </DesktopOnly>
    </React.Fragment>
  )
}

const Header = ({name, hash}) => {
  const classes = useHeaderStyles()
  const {translate} = useI18n()
  const {addPool, removePool, selectedPools} = useSelectedPoolsContext()
  const selected = selectedPools.includes(hash)

  const onAddPool = useCallback(() => addPool(hash), [addPool, hash])
  const onRemovePool = useCallback(() => removePool(hash), [removePool, hash])

  return (
    <Grid
      container
      wrap="nowrap"
      justify="space-between"
      alignItems="center"
      className={classes.wrapper}
    >
      <Grid item className={classes.flexEllipsize}>
        <PoolEntityContent name={name} hash={hash} />
      </Grid>
      <Grid item>
        {selected ? (
          <RemovePoolButton onClick={onRemovePool} label={translate(messages.removePool)} />
        ) : (
          <AddPoolButton onClick={onAddPool} label={translate(messages.addPool)} />
        )}
      </Grid>
    </Grid>
  )
}

const DataGrid = ({items, leftSpan, rightSpan, alignRight = false}) => {
  const classes = useContentStyles()

  return (
    // Note: when setting direction to `column` there is strange height misallignment
    <Grid container direction="row" className={classes.verticalBlock}>
      {items.map(({label, value}, index) => (
        <Grid item key={index} xs={12}>
          <Grid container direction="row">
            <Grid xs={leftSpan} item className={classes.rowItem}>
              <Typography className={classes.label}>{label}</Typography>
            </Grid>
            <Grid
              xs={rightSpan}
              item
              className={cn(classes.rowItem, alignRight && classes.alignRight)}
            >
              {value}
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  )
}

const useRewardClasses = makeStyles(({spacing, palette}) => ({
  rewardsMoreIcon: {
    'position': 'absolute',
    'right': 0,
    'top': -14,
    '&:hover': {
      backgroundColor: fade(palette.primary.main, 0.08),
    },
  },
  menuItemLabel: {
    marginRight: spacing(2),
  },
}))

const _RewardsMenuItem = ({onClick, label, value, isActive}) => {
  const classes = useRewardClasses({isActive})
  return (
    <MenuItem selected={isActive} onClick={onClick}>
      <Grid container justify="space-between">
        <Typography className={classes.menuItemLabel}>{label}</Typography>
        <Typography color="textSecondary">{value}</Typography>
      </Grid>
    </MenuItem>
  )
}

// Note: using class because children of <Menu /> must be able to hold 'ref'
// TODO: Try to solve with `forwardRef`
class RewardsMenuItem extends React.Component<any> {
  render() {
    return <_RewardsMenuItem {...this.props} />
  }
}

const rewardsMessages = defineMessages({
  perEpoch: 'per epoch',
  perYear: 'per year',
  estimatedRewardsTooltip:
    'To enable other modes, please enter your ADA into the input besides Search',
})

const RewardsMenu = ({estimatedRewards}) => {
  const classes = useRewardClasses()
  const {translate: tr, formatPercent} = useI18n()
  const {userAda} = useUserAdaContext()
  const {estimatedRewardsMode, setEstimatedRewardsMode} = useEstimatedRewardsMode()

  const [anchorEl, setAnchorEl] = React.useState(null)
  const handleClick = useCallback(
    (event) => {
      userAda && setAnchorEl(event.currentTarget)
    },
    [userAda]
  )
  const handleClose = useCallback(() => setAnchorEl(null), [setAnchorEl])

  const _getOnClickHandler = useCallback(
    (mode) => () => {
      handleClose()
      setEstimatedRewardsMode(mode)
    },
    [handleClose, setEstimatedRewardsMode]
  )

  const onEpochModeClick = useMemo(() => _getOnClickHandler(ESTIMATED_REWARDS_MODES.EPOCH), [
    _getOnClickHandler,
  ])
  const onYearModeClick = useMemo(() => _getOnClickHandler(ESTIMATED_REWARDS_MODES.YEAR), [
    _getOnClickHandler,
  ])
  const onPercentageModeClick = useMemo(
    () => _getOnClickHandler(ESTIMATED_REWARDS_MODES.PERCENTAGE),
    [_getOnClickHandler]
  )

  return (
    <React.Fragment>
      <Tooltip
        placement="bottom"
        title={tr(rewardsMessages.estimatedRewardsTooltip)}
        disableHoverListener={!!userAda}
        disableTouchListener={!!userAda}
      >
        <div>
          <IconButton
            className={classes.rewardsMoreIcon}
            onClick={handleClick}
            disableRipple={!userAda}
          >
            <MoreVert color="primary" />
          </IconButton>
        </div>
      </Tooltip>
      <Menu anchorEl={anchorEl} keepMounted open={!!anchorEl} onClose={handleClose}>
        <RewardsMenuItem
          onClick={onEpochModeClick}
          isActive={estimatedRewardsMode === ESTIMATED_REWARDS_MODES.EPOCH}
          label={<AdaValue showCurrency value={estimatedRewards.perEpoch.ada} disableFiatTooltip />}
          value={tr(rewardsMessages.perEpoch)}
        />
        <RewardsMenuItem
          onClick={onYearModeClick}
          isActive={estimatedRewardsMode === ESTIMATED_REWARDS_MODES.YEAR}
          label={<AdaValue showCurrency value={estimatedRewards.perYear.ada} disableFiatTooltip />}
          value={tr(rewardsMessages.perYear)}
        />
        <RewardsMenuItem
          onClick={onPercentageModeClick}
          isActive={estimatedRewardsMode === ESTIMATED_REWARDS_MODES.PERCENTAGE}
          label={formatPercent(estimatedRewards.perYear.percentage)}
          value={tr(rewardsMessages.perYear)}
        />
      </Menu>
    </React.Fragment>
  )
}

const EstimatedRewards = ({estimatedRewards}) => {
  const {formatPercent} = useI18n()
  const {userAda} = useUserAdaContext()
  const {estimatedRewardsMode} = useEstimatedRewardsMode()

  if (!userAda || estimatedRewardsMode === ESTIMATED_REWARDS_MODES.PERCENTAGE) {
    return <Typography>{formatPercent(estimatedRewards.perYear.percentage)}</Typography>
  }

  if (estimatedRewardsMode === ESTIMATED_REWARDS_MODES.EPOCH) {
    return <AdaValue showCurrency value={estimatedRewards.perEpoch.ada} />
  }

  if (estimatedRewardsMode === ESTIMATED_REWARDS_MODES.YEAR) {
    return <AdaValue showCurrency value={estimatedRewards.perYear.ada} />
  }

  return null
}

const Content = ({data}) => {
  const {translate: tr, formatPercent, formatTimestamp} = useI18n()
  const classes = useContentStyles()
  const isMobile = useIsMobile()
  const isDownLg = useIsBreakpointDown('lg')

  return (
    <div className={classes.innerWrapper}>
      {!isMobile && (
        <div className={classes.revenueWrapper}>
          <ResponsiveCircularProgressBar label={tr(messages.revenue)} value={0.25} />
        </div>
      )}
      <Grid container>
        <Grid item xs={12} lg={6}>
          <DataGrid
            alignRight={isDownLg}
            leftSpan={6}
            rightSpan={6}
            items={[
              {
                label: (
                  <HelpTooltip text={tr(messages.performanceHelpText)}>
                    {tr(messages.performance)}
                  </HelpTooltip>
                ),
                value: <Typography>{formatPercent(data.performance)}</Typography>,
              },
              {
                label: (
                  <HelpTooltip text={tr(messages.fullnessHelpText)}>
                    {tr(messages.fullness)}
                  </HelpTooltip>
                ),
                value: <Typography>{formatPercent(data.fullness)}</Typography>,
              },
              {
                label: (
                  <HelpTooltip text={tr(messages.marginsHelpText)}>
                    {tr(messages.margins)}
                  </HelpTooltip>
                ),
                value: <Typography>{formatPercent(data.margins)}</Typography>,
              },
              {
                label: (
                  <HelpTooltip text={tr(messages.createdAtHelpText)}>
                    {tr(messages.createdAt)}
                  </HelpTooltip>
                ),
                value: (
                  <Typography>
                    {formatTimestamp(data.createdAt, {format: formatTimestamp.FMT_MONTH_NUMERAL})}
                  </Typography>
                ),
              },
            ]}
          />
        </Grid>

        <Grid item xs={12} lg={6}>
          <DataGrid
            alignRight={isDownLg}
            leftSpan={6}
            rightSpan={6}
            items={[
              {
                label: (
                  <HelpTooltip text={tr(messages.costHelpText)}>{tr(messages.cost)}</HelpTooltip>
                ),
                value: <AdaValue showCurrency value={data.cost} />,
              },
              {
                label: (
                  <HelpTooltip text={tr(messages.stakeHelpText)}>{tr(messages.stake)}</HelpTooltip>
                ),
                value: <AdaValue showCurrency value={data.stake} />,
              },
              {
                label: (
                  <HelpTooltip text={tr(messages.pledgeHelpText)}>
                    {tr(messages.pledge)}
                  </HelpTooltip>
                ),
                value: <AdaValue showCurrency value={data.pledge} />,
              },
              {
                label: (
                  <HelpTooltip text={tr(messages.rewardsHelpText)}>
                    {tr(messages.rewards)}
                  </HelpTooltip>
                ),
                value: (
                  <div className={classes.rewardsRowWrapper}>
                    <EstimatedRewards estimatedRewards={data.estimatedRewards} />
                    <RewardsMenu estimatedRewards={data.estimatedRewards} />
                  </div>
                ),
              },
            ]}
          />
        </Grid>
      </Grid>
    </div>
  )
}

const usePoolFooterStyles = makeStyles((theme) => ({
  wrapper: {
    position: 'relative',
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
  },
  defaultFooterWrapper: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
}))

const DesktopPoolFooter = ({expanded}) => {
  const {translate: tr} = useI18n()

  const label = tr(expanded ? messages.hideDesc : messages.showDesc)
  return <ExpandableCardFooter {...{label, expanded}} />
}

const MobilePoolFooter = ({expanded}) => {
  const {translate: tr} = useI18n()
  const classes = usePoolFooterStyles()

  const label = tr(expanded ? messages.hideDetails : messages.showDetails)
  return (
    <Grid container alignContent="center" wrap="nowrap" className={classes.wrapper}>
      <ResponsiveCircularProgressBar label={tr(messages.revenue)} value={0.25} />
      <div className={classes.defaultFooterWrapper}>
        <ExpandableCardFooter {...{label, expanded}} />
      </div>
    </Grid>
  )
}

const AdvancedMobileStakepoolCard = ({isOpen, toggle, data}) => {
  const renderExpandedArea = () => <Content data={data} />
  const renderHeader = () => <Header name={data.name} hash={data.hash} />
  const renderFooter = (expanded) => <MobilePoolFooter expanded={expanded} />

  return (
    <ExpandableCard
      expanded={isOpen}
      onChange={toggle}
      renderHeader={renderHeader}
      renderExpandedArea={renderExpandedArea}
      renderFooter={renderFooter}
    />
  )
}

type AgeProps = {|
  +epochCount: number,
|}

const Age = ({epochCount}: AgeProps) => {
  const {translate: tr} = useI18n()
  const classes = useContentStyles()
  return (
    <Grid container alignItems="center" className={classes.ageWrapper}>
      <img alt="" src={epochIcon} />
      <Typography component="span" variant="overline" color="textSecondary">
        {tr(messages.ageLabel)}
      </Typography>
      <Typography component="span" variant="overline">
        {tr(messages.ageValue, {epochCount})}
      </Typography>
    </Grid>
  )
}

const AdvancedDesktopStakepoolCard = ({isOpen, toggle, data}) => {
  const classes = useContentStyles()

  const renderExpandedArea = () => (
    <div className={classes.extraContent}>
      <Typography>{data.description}</Typography>
      <Age epochCount={data.age} />
    </div>
  )

  const renderHeader = () => (
    <React.Fragment>
      <Header name={data.name} hash={data.hash} />
      <Content data={data} />
    </React.Fragment>
  )

  const renderFooter = (expanded) => <DesktopPoolFooter expanded={expanded} />

  return (
    <ExpandableCard
      expanded={isOpen}
      onChange={toggle}
      renderHeader={renderHeader}
      renderExpandedArea={renderExpandedArea}
      renderFooter={renderFooter}
    />
  )
}

type Props = {
  data: Object, // TODO: type better
}

const AdvancedStakepoolCard = ({data}: Props) => {
  const isMobile = useIsMobile()

  return (
    <WithModalState>
      {({isOpen, toggle}) => {
        const props = {isOpen, toggle, data}
        const PoolComponent = isMobile ? AdvancedMobileStakepoolCard : AdvancedDesktopStakepoolCard
        return <PoolComponent {...props} />
      }}
    </WithModalState>
  )
}

export default AdvancedStakepoolCard
