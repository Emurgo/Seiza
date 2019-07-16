// @flow

import React, {useCallback} from 'react'
import cn from 'classnames'
import {Grid, Typography, IconButton} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {
  ExpandableCard,
  ExpandableCardFooter,
  Button,
  MobileOnly,
  DesktopOnly,
} from '@/components/visual'
import {AdaValue, PoolEntityContent, ResponsiveCircularProgressBar} from '@/components/common'
import WithModalState from '@/components/headless/modalState'
import {useI18n} from '@/i18n/helpers'
import {useSelectedPoolsContext} from '../context/selectedPools'
import {useIsMobile, useIsBreakpointDown} from '@/components/hooks/useBreakpoints'
import {ReactComponent as AddPoolIcon} from '@/static/assets/icons/staking-simulator/add-stakepool.svg'
import {ReactComponent as RemovePoolIcon} from '@/static/assets/icons/close.svg'
import {fade} from '@material-ui/core/styles/colorManipulator'

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
}))

// TODO: move to refactored Button.js component (#803)
// it's here temporarily to avoid nasty conflict resolution

// not sure REFERENCE_GRADIENT is the best naming, it was copied from
// https://codepen.io/miraviolet/pen/ZobWEg and extracted to this constant here
const REFERENCE_GRADIENT = 'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))'

const useMobilePoolButtonStyles = makeStyles(({palette}) => ({
  addButton: {
    'borderRadius': '50%',
    'width': 48,
    'height': 48,
    'background': palette.buttons.tertiaryGradient.background,
    'color': palette.buttons.tertiaryGradient.textColor,
    '&:hover': {
      background: palette.buttons.tertiaryGradient.hover,
      color: palette.buttons.tertiaryGradient.textHover,
    },
  },
  removeButton: {
    'borderRadius': '50%',
    'width': 48,
    'height': 48,

    // https://codepen.io/miraviolet/pen/ZobWEg
    'background': palette.background.default,
    'color': palette.primary.main,

    '&:hover': {
      backgroundImage: `${REFERENCE_GRADIENT}, ${palette.buttons.tertiaryGradient.hover}`,
    },
    'border': '1px solid transparent',
    'backgroundImage': `${REFERENCE_GRADIENT}, ${palette.buttons.tertiaryGradient.background}`,
    'backgroundOrigin': 'border-box',
    'backgroundClip': 'content-box, border-box',
    'boxShadow': `2px 1000px 1px ${palette.background.default} inset`,
    // :after is used only for proper shadow
    '&:after': {
      borderRadius: '50%',
      content: '""',
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: 'transparent',
      bottom: -1,
      right: 0,
      boxShadow: `0px 8px 20px ${fade(palette.text.primary, 0.08)}`,
    },
    '&:hover:after': {
      boxShadow: `0px 10px 30px ${fade(palette.text.primary, 0.14)}`,
    },
  },
}))

const AddPoolButton = ({onClick, label}) => {
  const classes = useHeaderStyles()
  const buttonClasses = useMobilePoolButtonStyles()

  return (
    <React.Fragment>
      <MobileOnly>
        <IconButton onClick={onClick} className={buttonClasses.addButton}>
          <AddPoolIcon />
        </IconButton>
      </MobileOnly>

      <DesktopOnly>
        <Button rounded primaryGradient onClick={onClick} className={classes.button}>
          {label}
        </Button>
      </DesktopOnly>
    </React.Fragment>
  )
}

const RemovePoolButton = ({onClick, label}) => {
  const classes = useHeaderStyles()
  const buttonClasses = useMobilePoolButtonStyles()

  return (
    <React.Fragment>
      <MobileOnly>
        <IconButton onClick={onClick} className={buttonClasses.removeButton}>
          <RemovePoolIcon />
        </IconButton>
      </MobileOnly>

      <DesktopOnly>
        <Button rounded secondaryGradient onClick={onClick} className={classes.button}>
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
      {items.map(({label, value}) => (
        <Grid item key={label} xs={12}>
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
  const {translate, formatPercent, formatTimestamp} = useI18n()
  const classes = useContentStyles()
  const isMobile = useIsMobile()
  const isDownLg = useIsBreakpointDown('lg')
  return (
    <div className={classes.innerWrapper}>
      {!isMobile && (
        <div className={classes.revenueWrapper}>
          <ResponsiveCircularProgressBar label={translate(messages.revenue)} value={0.25} />
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
                label: translate(messages.performance),
                value: <Typography>{formatPercent(data.performance)}</Typography>,
              },
              {
                label: translate(messages.fullness),
                value: <Typography>{formatPercent(data.fullness)}</Typography>,
              },
              {
                label: translate(messages.margins),
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
                label: translate(messages.createdAt),
                value: (
                  <Typography>
                    {formatTimestamp(data.createdAt, {format: formatTimestamp.FMT_MONTH_NUMERAL})}
                  </Typography>
                ),
              },
              {
                label: translate(messages.pledge),
                value: <AdaValue value={data.pledge} />,
              },
              {
                label: translate(messages.stake),
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

const DesktopStakePool = ({isOpen, toggle, data}) => {
  const classes = useContentStyles()

  const renderExpandedArea = () => (
    <Typography className={classes.extraContent}>{data.description}</Typography>
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
