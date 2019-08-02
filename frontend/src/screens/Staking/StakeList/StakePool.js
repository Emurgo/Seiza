// @flow
import React, {useCallback} from 'react'
import cn from 'classnames'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {
  ExpandableCard,
  ExpandableCardFooter,
  Button,
  MobileOnly,
  DesktopOnly,
} from '@/components/visual'
import {
  AdaValue,
  PoolEntityContent,
  ResponsiveCircularProgressBar,
  HelpTooltip,
} from '@/components/common'
import WithModalState from '@/components/headless/modalState'
import {useI18n} from '@/i18n/helpers'
import {useSelectedPoolsContext} from '../context/selectedPools'
import {useIsMobile, useIsBreakpointDown} from '@/components/hooks/useBreakpoints'
import {ReactComponent as AddPoolIcon} from '@/static/assets/icons/staking-simulator/add-stakepool.svg'
import {ReactComponent as RemovePoolIcon} from '@/static/assets/icons/close.svg'
import epochIcon from '@/static/assets/icons/epoch.svg'

const messages = defineMessages({
  revenue: 'Revenue',
  performance: 'Performance:',
  pledge: 'Pledge:',
  margins: 'Margins:',
  createdAt: 'Creation time:',
  fullness: 'Fullness:',
  stake: 'Stake:',
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
        <Grid item xs={12} lg={4} xl={5}>
          <DataGrid
            alignRight={isDownLg}
            leftSpan={isDownLg ? 6 : 9}
            rightSpan={isDownLg ? 6 : 3}
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
            ]}
          />
        </Grid>

        <Grid item xs={12} lg={8} xl={7}>
          <DataGrid
            alignRight={isDownLg}
            leftSpan={6}
            rightSpan={6}
            items={[
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
              {
                label: (
                  <HelpTooltip text={tr(messages.pledgeHelpText)}>
                    {tr(messages.pledge)}
                  </HelpTooltip>
                ),
                value: <AdaValue value={data.pledge} />,
              },
              {
                label: (
                  <HelpTooltip text={tr(messages.stakeHelpText)}>{tr(messages.stake)}</HelpTooltip>
                ),
                value: <AdaValue value={data.stake} />,
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

const MobileStakePool = ({isOpen, toggle, data}) => {
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

const DesktopStakePool = ({isOpen, toggle, data}) => {
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

const StakePool = ({data}: Props) => {
  const isMobile = useIsMobile()

  return (
    <WithModalState>
      {({isOpen, toggle}) => {
        const props = {isOpen, toggle, data}
        const PoolComponent = isMobile ? MobileStakePool : DesktopStakePool
        return <PoolComponent {...props} />
      }}
    </WithModalState>
  )
}

export default StakePool
