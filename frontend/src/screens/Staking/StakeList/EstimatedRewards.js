// @flow
import React, {useCallback, useMemo} from 'react'
import {Grid, Typography, IconButton, Menu, MenuItem, Hidden} from '@material-ui/core'
import {ArrowDropDown as RewardsIcon} from '@material-ui/icons'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'
import {fade} from '@material-ui/core/styles/colorManipulator'

import {Tooltip} from '@/components/visual'
import {AdaValue} from '@/components/common'
import {useI18n} from '@/i18n/helpers'

import {useUserAdaContext} from '../context/userAda'
import {ESTIMATED_REWARDS_MODES, useEstimatedRewardsMode} from './estimatedRewardsModeUtils'

const useClasses = makeStyles(({spacing, palette}) => ({
  rewardsMoreIcon: {
    'padding': 0,
    'marginRight': spacing(0.3),
    '&:hover': {
      backgroundColor: fade(palette.primary.main, 0.08),
    },
  },
  menuItemLabel: {
    marginRight: spacing(2),
  },
  rewardsRowWrapper: {
    display: 'inline-flex',
    justifyContent: 'flex-end',
  },
}))

const _RewardsMenuItem = ({onClick, label, value, isActive}) => {
  const classes = useClasses({isActive})
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
  const classes = useClasses()
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
            <RewardsIcon color="primary" fontSize="small" />
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

// TODO: rather extract from graphql
type _EstimatedRewardsType = {|
  percentage: number,
  ada: string,
|}

export type EstimatedRewardsType = {|
  perEpoch: _EstimatedRewardsType,
  perYear: _EstimatedRewardsType,
  perMonth: _EstimatedRewardsType,
|}

type Props = {|
  estimatedRewards: EstimatedRewardsType,
|}

export default ({estimatedRewards}: Props) => {
  const classes = useClasses()
  return (
    <div className={classes.rewardsRowWrapper}>
      <Hidden mdDown>
        <EstimatedRewards estimatedRewards={estimatedRewards} />
        <RewardsMenu estimatedRewards={estimatedRewards} />
      </Hidden>
      <Hidden lgUp>
        <RewardsMenu estimatedRewards={estimatedRewards} />
        <EstimatedRewards estimatedRewards={estimatedRewards} />
      </Hidden>
    </div>
  )
}
