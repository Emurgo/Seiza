// @flow
import React, {useMemo} from 'react'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {
  ExpandableCard,
  ExpandableCardFooter,
  Tooltip,
  DesktopOnly,
  MobileOnly,
} from '@/components/visual'
import {PoolEntityContent, ResponsiveCircularProgressBar, AdaValue} from '@/components/common'
import WithModalState from '@/components/headless/modalState'
import {useI18n} from '@/i18n/helpers'
import epochIcon from '@/static/assets/icons/epoch.svg'

import {useUserAdaContext} from '../context/userAda'
import {DataGrid, getStakepoolCardFields} from '../StakeList/stakepoolCardUtils'

const messages = defineMessages({
  revenue: 'Revenue',
  hideDesc: 'Hide description',
  showDesc: 'Full description',
  hideDetails: 'Hide details',
  showDetails: 'Show details',
  addPool: 'Add',
  removePool: 'Remove',
  estimatedRewards: 'Rewards (Month):',
  ageLabel: 'Age:',
  ageValue: '{epochCount, plural, =0 {# epochs} one {# epoch} other {# epochs}}',
  estimatedRewardsTooltip:
    'To also show estimate in ADA, please enter your ADA amount into the field besides Search field',
})

const useHeaderStyles = makeStyles(({palette, spacing, breakpoints}) => ({
  wrapper: {
    background: palette.background.paperContrast,
    padding: spacing(1),
    [breakpoints.up('md')]: {
      padding: spacing(3),
    },
  },
  flexEllipsize: {
    // needed for proper ellipsize in children components with flex
    minWidth: 0,
  },
  estimatedRewardsLabel: {
    textTransform: 'uppercase',
  },
  offsetPercentageRewards: {
    paddingLeft: spacing(1),
  },
  headerRewards: {
    display: 'none',
    [breakpoints.up('md')]: {
      display: 'initial',
    },
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
    alignItems: 'center',
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

const EstimatedRewards = ({estimatedRewards}) => {
  const classes = useHeaderStyles()
  const {translate: tr, formatPercent} = useI18n()
  const {userAda} = useUserAdaContext()

  const percentageRewards = formatPercent(estimatedRewards.perMonth.percentage)

  return (
    <Tooltip
      placement="bottom"
      title={tr(messages.estimatedRewardsTooltip)}
      disableHoverListener={!!userAda}
      disableTouchListener={!!userAda}
    >
      <div>
        <Typography color="textSecondary" className={classes.estimatedRewardsLabel}>
          {tr(messages.estimatedRewards)}
        </Typography>
        {userAda ? (
          <div className="d-flex">
            <AdaValue showCurrency value={estimatedRewards.perMonth.ada} />
            <Typography className={classes.offsetPercentageRewards}>
              ({percentageRewards})
            </Typography>
          </div>
        ) : (
          <Typography>{percentageRewards}</Typography>
        )}
      </div>
    </Tooltip>
  )
}

const Header = ({name, hash, estimatedRewards}) => {
  const classes = useHeaderStyles()

  return (
    <Grid
      container
      wrap="nowrap"
      justify="space-between"
      alignItems="center"
      className={classes.wrapper}
    >
      <Grid item xs={12} md={6} className={classes.flexEllipsize}>
        <PoolEntityContent name={name} hash={hash} />
      </Grid>
      <Grid item md={6} className={classes.headerRewards}>
        <Grid container direction="column" alignItems="flex-end">
          <EstimatedRewards estimatedRewards={estimatedRewards} />
        </Grid>
      </Grid>
    </Grid>
  )
}

const Content = ({data}) => {
  const formatters = useI18n()
  const {translate: tr} = formatters
  const classes = useContentStyles()

  const fields = useMemo(() => getStakepoolCardFields({formatters, data}), [formatters, data])
  const leftSideItems = useMemo(() => [fields.stake], [fields])
  const rightSideItems = useMemo(() => [fields.cost], [fields])

  return (
    <div className={classes.innerWrapper}>
      <DesktopOnly className="d-flex">
        <div className={classes.revenueWrapper}>
          <ResponsiveCircularProgressBar label={tr(messages.revenue)} value={0.25} />
        </div>
      </DesktopOnly>
      <DataGrid {...{rightSideItems, leftSideItems}} />
      <MobileOnly>
        <EstimatedRewards estimatedRewards={data.estimatedRewards} />
      </MobileOnly>
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

const SimpleMobileStakepoolCard = ({isOpen, toggle, data}) => {
  const renderExpandedArea = () => <Content data={data} />
  const renderHeader = () => (
    <Header name={data.name} hash={data.hash} estimatedRewards={data.estimatedRewards} />
  )
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

const SimpleDesktopStakepoolCard = ({isOpen, toggle, data}) => {
  const classes = useContentStyles()

  const renderExpandedArea = () => (
    <div className={classes.extraContent}>
      <Typography>{data.description}</Typography>
      <Age epochCount={data.age} />
    </div>
  )

  const renderHeader = () => (
    <React.Fragment>
      <Header name={data.name} hash={data.hash} estimatedRewards={data.estimatedRewards} />
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

const SimpleStakepoolCard = ({data}: Props) => (
  <WithModalState>
    {({isOpen, toggle}) => {
      const props = {isOpen, toggle, data}
      return (
        <React.Fragment>
          <MobileOnly>
            <SimpleMobileStakepoolCard {...props} />
          </MobileOnly>
          <DesktopOnly>
            <SimpleDesktopStakepoolCard {...props} />
          </DesktopOnly>
        </React.Fragment>
      )
    }}
  </WithModalState>
)

export default SimpleStakepoolCard
