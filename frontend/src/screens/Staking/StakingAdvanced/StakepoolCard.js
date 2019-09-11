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
  Tooltip,
} from '@/components/visual'
import {PoolEntityContent, ResponsiveCircularProgressBar} from '@/components/common'
import WithModalState from '@/components/headless/modalState'
import {useI18n} from '@/i18n/helpers'
import {useSelectedPoolsContext} from '../context/selectedPools'
import config from '@/config'

import {ReactComponent as AddPoolIcon} from '@/static/assets/icons/staking-simulator/add-stakepool.svg'
import {ReactComponent as RemovePoolIcon} from '@/static/assets/icons/close.svg'

import {
  DataGrid,
  getStakepoolCardFields,
  MobilePoolFooter,
  StakepoolMobileCard,
  useCommonContentStyles,
  Age,
} from '../StakeList/stakepoolCardUtils'

const messages = defineMessages({
  revenue: 'Revenue',
  hideDesc: 'Hide description',
  showDesc: 'Full description',
  addPool: 'Add',
  removePool: 'Remove',
  // Note(bigamasta): If needed to be reused on Stake pools screens,
  // we can create something like helpers/helpMessages.js
  disabledButton: 'You have reached maximum limit of stakepools',
  yoroi__seeMoreInSeiza: 'See More in Seiza',
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
  extraContentMobile: {
    paddingTop: spacing(2),
  },
  extraContentDesktop: {
    padding: spacing(3),
  },
  alignRight: {
    textAlign: 'right',
  },
}))

const AddPoolButton = ({onClick, label, disabled}) => {
  const classes = useHeaderStyles()

  return (
    <React.Fragment>
      <MobileOnly>
        <Button
          rounded
          gradient
          variant="contained"
          disabled={disabled}
          gradientDegree={45}
          onClick={onClick}
          className={classes.mobileButton}
        >
          <AddPoolIcon />
        </Button>
      </MobileOnly>

      <DesktopOnly>
        <Button
          rounded
          gradient
          variant="contained"
          disabled={disabled}
          onClick={onClick}
          className={classes.button}
        >
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
  const {translate: tr} = useI18n()
  const {addPool, removePool, selectedPools, isListFull} = useSelectedPoolsContext()
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
        <PoolEntityContent
          name={name}
          hash={hash}
          hashTooltip={config.isYoroi && tr(messages.yoroi__seeMoreInSeiza)}
        />
      </Grid>
      <Grid item>
        {selected ? (
          <RemovePoolButton onClick={onRemovePool} label={tr(messages.removePool)} />
        ) : (
          <Tooltip
            title={tr(messages.disabledButton)}
            placement="bottom"
            disableHoverListener={!isListFull}
            disableTouchListener={!isListFull}
          >
            <div>
              <AddPoolButton
                disabled={isListFull}
                onClick={onAddPool}
                label={tr(messages.addPool)}
              />
            </div>
          </Tooltip>
        )}
      </Grid>
    </Grid>
  )
}

const Content = ({data}) => {
  const formatters = useI18n()
  const {translate: tr} = formatters
  const classes = useContentStyles()
  const commonClasses = useCommonContentStyles()

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
    <div className={commonClasses.innerWrapper}>
      <DesktopOnly>
        <div className={commonClasses.revenueWrapper}>
          <ResponsiveCircularProgressBar label={tr(messages.revenue)} value={0.25} />
        </div>
      </DesktopOnly>
      <DataGrid {...{leftSideItems, rightSideItems}} />
      <MobileOnly>
        <div className={classes.extraContentMobile}>
          <Typography>{data.description}</Typography>
          <Age epochCount={data.age} />
        </div>
      </MobileOnly>
    </div>
  )
}

const DesktopPoolFooter = ({expanded}) => {
  const {translate: tr} = useI18n()

  const label = tr(expanded ? messages.hideDesc : messages.showDesc)
  return <ExpandableCardFooter {...{label, expanded}} />
}

const AdvancedMobileStakepoolCard = React.memo(({isOpen, toggle, data}) => {
  const renderExpandedArea = () => <Content data={data} />

  const renderHeader = (expanded) => (
    <Grid container direction="column">
      <MobilePoolFooter expanded={expanded} />
    </Grid>
  )

  return (
    <StakepoolMobileCard
      expanded={isOpen}
      onChange={toggle}
      nonExpandableHeader={<Header name={data.name} hash={data.hash} />}
      renderHeader={renderHeader}
      renderExpandedArea={renderExpandedArea}
    />
  )
})

const AdvancedDesktopStakepoolCard = ({isOpen, toggle, data}) => {
  const classes = useContentStyles()

  const renderExpandedArea = () => (
    <div className={classes.extraContentDesktop}>
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
