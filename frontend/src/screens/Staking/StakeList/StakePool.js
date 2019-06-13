import React, {useCallback} from 'react'
import {compose} from 'redux'
import {Grid, createStyles, withStyles, Typography} from '@material-ui/core'
import {defineMessages} from 'react-intl'

import {
  ExpandableCard,
  Button,
  AdaValue,
  CircularProgressBar,
  VisualHash,
} from '@/components/visual'
import WithModalState from '@/components/headless/modalState'
import {withI18n} from '@/i18n/helpers'
import {useSelectedPoolsContext} from '../context/selectedPools'

const messages = defineMessages({
  performance: 'Performance:',
  pledge: 'Pledge:',
  margins: 'Margins:',
  createdAt: 'Creation time:',
  fullness: 'Fullness:',
  stake: 'Stake:',
  hideDesc: 'Hide description',
  showDesc: 'Full description',
  addPool: 'Add',
  removePool: 'Remove',
})

const headerStyles = ({palette, spacing}) =>
  createStyles({
    wrapper: {
      background: palette.background.paperContrast,
      padding: spacing.unit * 3,
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
  })

const contentStyles = ({palette, spacing}) =>
  createStyles({
    verticalBlock: {
      paddingRight: spacing.unit * 3,
    },
    label: {
      color: palette.grey[500], // TODO: make fit any theme
      textTransform: 'uppercase',
    },
    rowItem: {
      paddingTop: spacing.unit,
      paddingBottom: spacing.unit,
    },
    innerWrapper: {
      padding: spacing.unit * 3,
    },
    extraContent: {
      padding: spacing.unit * 3,
    },
  })

const cardStyles = ({pallete}) =>
  createStyles({
    wrapper: {
      opacity: 0.6,
    },
  })
const Header = compose(
  withI18n,
  withStyles(headerStyles)
)(({classes, name, hash, i18n: {translate}}) => {
  const {addPool, removePool, selectedPools} = useSelectedPoolsContext()
  const selected = selectedPools.includes(hash)

  const onAddPool = useCallback(() => addPool(hash), [addPool, hash])
  const onRemovePool = useCallback(() => removePool(hash), [removePool, hash])

  return (
    <Grid
      className={classes.wrapper}
      container
      justify="space-between"
      alignItems="center"
      direction="row"
    >
      <Grid item>
        <Grid container direction="row">
          <Grid item className={classes.dot}>
            <VisualHash value={hash} size={48} />
          </Grid>
          <Grid item>
            <Grid container direction="column" className={classes.info}>
              <Typography variant="h6">{name}</Typography>
              <Typography>{hash}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        {selected ? (
          <Button rounded secondaryGradient onClick={onRemovePool} className={classes.button}>
            {translate(messages.removePool)}
          </Button>
        ) : (
          <Button rounded primaryGradient onClick={onAddPool} className={classes.button}>
            {translate(messages.addPool)}
          </Button>
        )}
      </Grid>
    </Grid>
  )
})

const DataGrid = withStyles(contentStyles)(({items, classes}) => (
  // Note: when setting direction to `column` there is strange height misallignment
  <Grid container direction="row" className={classes.verticalBlock}>
    {items.map(({label, value}) => (
      <Grid item key={label} xs={12}>
        <Grid container direction="row">
          <Grid xs={6} item className={classes.rowItem}>
            <Typography className={classes.label}>{label}</Typography>
          </Grid>
          <Grid xs={6} item className={classes.rowItem}>
            {value}
          </Grid>
        </Grid>
      </Grid>
    ))}
  </Grid>
))

const Content = compose(
  withI18n,
  withStyles(contentStyles)
)(({data, classes, i18n: {translate, formatAda, formatPercent, formatTimestamp}}) => (
  <React.Fragment>
    <Header className={classes.wrapper} name={data.name} hash={data.hash} />
    <Grid className={classes.innerWrapper} container justify="space-between" direction="row">
      <Grid item xs={1} container justify="space-around" direction="column">
        <CircularProgressBar label="Revenue" value={0.25} />
      </Grid>
      <Grid item xs={5}>
        <DataGrid
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
      </Grid>

      <Grid item xs={5}>
        <DataGrid
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
      </Grid>
    </Grid>
  </React.Fragment>
))

const ExtraContent = withStyles(contentStyles)(({data, classes}) => (
  <Typography className={classes.extraContent}>{data.description}</Typography>
))

const StakePool = ({classes, data, i18n: {translate}}) => (
  <WithModalState>
    {({isOpen, toggle}) => (
      <ExpandableCard
        expanded={isOpen}
        onChange={toggle}
        renderHeader={() => <Content data={data} />}
        renderExpandedArea={() => <ExtraContent data={data} />}
        footer={translate(isOpen ? messages.hideDesc : messages.showDesc)}
      />
    )}
  </WithModalState>
)

export default compose(
  withI18n,
  withStyles(cardStyles)
)(StakePool)
