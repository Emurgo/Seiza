// @flow

import React, {useCallback} from 'react'
import cn from 'classnames'
import {Grid, Typography, IconButton} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'
import {AddCircle as AddPoolIcon, RemoveCircle as RemovePoolIcon} from '@material-ui/icons'

import {
  ExpandableCard,
  ExpandableCardFooter,
  Button,
  CircularProgressBar,
} from '@/components/visual'
import {AdaValue, PoolEntityContent} from '@/components/common'
import WithModalState from '@/components/headless/modalState'
import {useI18n} from '@/i18n/helpers'
import {useSelectedPoolsContext} from '../context/selectedPools'
import {useIsMobile, useIsBreakpointDown} from '@/components/hooks/useBreakpoints'

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
    display: 'flex',
    alignItems: 'center',
  },
}))

const AddPoolButton = ({onClick, label}) => {
  const classes = useHeaderStyles()
  const isMobile = useIsMobile()

  return isMobile ? (
    <IconButton onClick={onClick}>
      <AddPoolIcon color="primary" fontSize="large" />
    </IconButton>
  ) : (
    <Button rounded primaryGradient onClick={onClick} className={classes.button}>
      {label}
    </Button>
  )
}

const RemovePoolButton = ({onClick, label}) => {
  const classes = useHeaderStyles()
  const isMobile = useIsMobile()

  return isMobile ? (
    <IconButton onClick={onClick}>
      <RemovePoolIcon color="disabled" fontSize="large" />
    </IconButton>
  ) : (
    <Button rounded secondaryGradient onClick={onClick} className={classes.button}>
      {label}
    </Button>
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
          <CircularProgressBar label={translate(messages.revenue)} value={0.25} />
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
      <CircularProgressBar label={tr(messages.revenue)} value={0.25} />
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
