import React from 'react'
import {compose} from 'redux'
import {Grid, createStyles, withStyles, Typography} from '@material-ui/core'
import {defineMessages} from 'react-intl'
import {withHandlers, withProps} from 'recompose'

import {ExpandableCard, Button, AdaValue, CircularProgressBar} from '@/components/visual'
import WithModalState from '@/components/headless/modalState'
import {withI18n} from '@/i18n/helpers'
import {withSelectedPoolsContext} from '../context'

const I18N_PREFIX = 'staking.stakePool'

const messages = defineMessages({
  performance: {
    id: `${I18N_PREFIX}.performance`,
    defaultMessage: 'Performance:',
  },
  pledge: {
    id: `${I18N_PREFIX}.pledge`,
    defaultMessage: 'Pledge:',
  },
  margins: {
    id: `${I18N_PREFIX}.margins`,
    defaultMessage: 'Margins:',
  },
  createdAt: {
    id: `${I18N_PREFIX}.createdAt`,
    defaultMessage: 'Creation time:',
  },
  fullness: {
    id: `${I18N_PREFIX}.fullness`,
    defaultMessage: 'Fullness:',
  },
  stake: {
    id: `${I18N_PREFIX}.stake`,
    defaultMessage: 'Stake:',
  },
  hideDesc: {
    id: `${I18N_PREFIX}.hideDesc`,
    defaultMessage: 'Hide description',
  },
  showDesc: {
    id: `${I18N_PREFIX}.showDesc`,
    defaultMessage: 'Full description',
  },
  addPool: {
    id: `${I18N_PREFIX}.addPool`,
    defaultMessage: 'Add',
  },
  removePool: {
    id: `${I18N_PREFIX}.removePool`,
    defaultMessage: 'Remove',
  },
})

const headerStyles = ({palette}) =>
  createStyles({
    wrapper: {
      background: palette.background.default,
      padding: '20px',
    },
    dot: {
      marginTop: '6px',
      width: '20px',
      height: '20px',
      background: palette.background.paper,
      borderRadius: '10px',
      border: `1px solid ${palette.grey[200]}`,
    },
    info: {
      paddingLeft: '10px',
    },
    button: {
      width: '120px',
    },
  })

const contentStyles = ({palette}) =>
  createStyles({
    verticalBlock: {
      paddingRight: '20px',
    },
    label: {
      color: palette.grey[500], // TODO: make fit any theme
      textTransform: 'uppercase',
    },
    rowItem: {
      paddingTop: '8px',
      paddingBottom: '8px',
    },
    innerWrapper: {
      padding: '20px',
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
  withStyles(headerStyles),
  withSelectedPoolsContext,
  withProps((props) => ({
    selected: props.selectedPoolsContext.selectedPools.includes(props.hash),
  })),
  withHandlers({
    onAddPool: ({selectedPoolsContext: {addPool}, hash}) => () => addPool(hash),
    onRemovePool: ({selectedPoolsContext: {removePool}, hash}) => () => removePool(hash),
  })
)(({classes, name, hash, i18n: {translate}, onAddPool, onRemovePool, selected}) => (
  <Grid
    className={classes.wrapper}
    container
    justify="space-between"
    alignItems="center"
    direction="row"
  >
    <Grid item>
      <Grid container direction="row">
        <Grid item>
          <div className={classes.dot} />
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
        <Button rounded primary onClick={onRemovePool} className={classes.button}>
          {translate(messages.removePool)}
        </Button>
      ) : (
        <Button rounded secondary onClick={onAddPool} className={classes.button}>
          {translate(messages.addPool)}
        </Button>
      )}
    </Grid>
  </Grid>
))

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
              value: <Typography>{formatTimestamp(data.createdAt)}</Typography>,
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

const ExtraContent = ({data}) => <div>{data.description}</div>

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
