// @flow
import React, {useCallback, useMemo} from 'react'
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
import {PoolEntityContent, ResponsiveCircularProgressBar} from '@/components/common'
import WithModalState from '@/components/headless/modalState'
import {useI18n} from '@/i18n/helpers'
import {useSelectedPoolsContext} from '../context/selectedPools'
import {ReactComponent as AddPoolIcon} from '@/static/assets/icons/staking-simulator/add-stakepool.svg'
import {ReactComponent as RemovePoolIcon} from '@/static/assets/icons/close.svg'
import epochIcon from '@/static/assets/icons/epoch.svg'

import {DataGrid, getStakepoolCardFields} from '../StakeList/stakepoolCardUtils'

const messages = defineMessages({
  revenue: 'Revenue',
  hideDesc: 'Hide description',
  showDesc: 'Full description',
  hideDetails: 'Hide details',
  showDetails: 'Show details',
  addPool: 'Add',
  removePool: 'Remove',
  // Note(bigamasta): If needed to be reused on Stake pools screens,
  // we can create something like helpers/helpMessages.js
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

const Content = ({data}) => {
  const formatters = useI18n()
  const {translate: tr} = formatters
  const classes = useContentStyles()

  const fields = useMemo(() => getStakepoolCardFields({formatters, data}), [formatters, data])
  const leftSideItems = useMemo(
    () => [fields.performance, fields.fullness, fields.margins, fields.createdAt],
    [fields]
  )
  const rightSideItems = useMemo(
    () => [fields.cost, fields.stake, fields.pledge, fields.estimatedRewards],
    [fields]
  )

  return (
    <div className={classes.innerWrapper}>
      <DesktopOnly>
        <div className={classes.revenueWrapper}>
          <ResponsiveCircularProgressBar label={tr(messages.revenue)} value={0.25} />
        </div>
      </DesktopOnly>
      <DataGrid {...{leftSideItems, rightSideItems}} />
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

const AdvancedStakepoolCard = ({data}: Props) => (
  <WithModalState>
    {({isOpen, toggle}) => {
      const props = {isOpen, toggle, data}
      return (
        <React.Fragment>
          <MobileOnly>
            <AdvancedMobileStakepoolCard {...props} />
          </MobileOnly>
          <DesktopOnly>
            <AdvancedDesktopStakepoolCard {...props} />
          </DesktopOnly>
        </React.Fragment>
      )
    }}
  </WithModalState>
)

export default AdvancedStakepoolCard
