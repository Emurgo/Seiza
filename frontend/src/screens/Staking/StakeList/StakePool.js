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
  AdaValue,
  CircularProgressBar,
  VisualHash,
} from '@/components/visual'
import WithModalState from '@/components/headless/modalState'
import {useI18n} from '@/i18n/helpers'
import {useSelectedPoolsContext} from '../context/selectedPools'
import {useIsMobile, useCurrentBreakpoint} from '@/components/hooks/useBreakpoints'

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
    padding: spacing.unit,
    [breakpoints.up('md')]: {
      padding: spacing(3),
    },
  },
  dot: {
    marginTop: '7px',
  },
  info: {
    paddingLeft: spacing.unit,
  },
  button: {
    width: '120px',
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
    width: 100,
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

// TODO: add copy to clipboard for hash
const Header = ({name, hash}) => {
  const classes = useHeaderStyles()
  const {translate} = useI18n()
  const {addPool, removePool, selectedPools} = useSelectedPoolsContext()
  const selected = selectedPools.includes(hash)

  const onAddPool = useCallback(() => addPool(hash), [addPool, hash])
  const onRemovePool = useCallback(() => removePool(hash), [removePool, hash])
  const isMobile = useIsMobile()
  const breakpoint = useCurrentBreakpoint()

  // TODO: try to do better
  const maxTextWidth = {
    xs: 140,
    sm: 400,
    md: 200, // goes down because side-menu appears
    lg: 500,
    xl: 600,
  }[breakpoint]

  return (
    <Grid
      container
      wrap="nowrap"
      justify="space-between"
      alignItems="center"
      className={classes.wrapper}
    >
      <Grid item>
        <Grid container>
          <Grid item className={classes.dot}>
            <VisualHash value={hash} size={isMobile ? 36 : 48} />
          </Grid>
          <Grid item>
            <Grid container direction="column" className={classes.info}>
              <Typography style={{maxWidth: maxTextWidth}} noWrap variant="h6">
                {name}
              </Typography>
              <Typography style={{maxWidth: maxTextWidth}} noWrap>
                {hash}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
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

const DataGrid = ({items, alignRight = false}) => {
  const classes = useContentStyles()

  return (
    // Note: when setting direction to `column` there is strange height misallignment
    <Grid container direction="row" className={classes.verticalBlock}>
      {items.map(({label, value}) => (
        <Grid item key={label} xs={12}>
          <Grid container direction="row">
            <Grid xs={6} item className={classes.rowItem}>
              <Typography className={classes.label}>{label}</Typography>
            </Grid>
            <Grid xs={6} item className={cn(classes.rowItem, alignRight && classes.alignRight)}>
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
  return (
    <div className={classes.innerWrapper}>
      {!isMobile && (
        <div className={classes.revenueWrapper}>
          <CircularProgressBar label={translate(messages.revenue)} value={0.25} />
        </div>
      )}
      <div className="flex-grow-1">
        <DataGrid
          alignRight={isMobile}
          items={[
            {
              label: translate(messages.performance),
              value: <Typography>{formatPercent(data.performance)}</Typography>,
            },
            {
              label: translate(messages.pledge),
              value: <AdaValue value={data.pledge} />,
            },
            {
              label: translate(messages.margins),
              value: <Typography>{formatPercent(data.margins)}</Typography>,
            },
          ]}
        />
      </div>

      <div className="flex-grow-1">
        <DataGrid
          alignRight={isMobile}
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
              label: translate(messages.fullness),
              value: <Typography>{formatPercent(data.fullness)}</Typography>,
            },
            {
              label: translate(messages.stake),
              value: <AdaValue value={data.stake} />,
            },
          ]}
        />
      </div>
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
