import React from 'react'
import {compose} from 'redux'
import {Grid, createStyles, withStyles, Typography} from '@material-ui/core'
import {defineMessages} from 'react-intl'

import {ExpandableCard, Button, AdaValue, CircularProgressBar} from '@/components/visual'
import WithModalState from '@/components/headless/modalState'
import {withI18n} from '@/i18n/helpers'

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

const Header = compose(
  withI18n,
  withStyles(headerStyles)
)(({classes, name, hash, i18n: {translate}}) => (
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
      <Button rounded secondary>
        {translate(messages.addPool)}
      </Button>
    </Grid>
  </Grid>
))

const DataGrid = withStyles(contentStyles)(({labels, values, classes}) => (
  <Grid container direction="row">
    <Grid item>
      <Grid
        container
        direction="column"
        alignItems="flex-start"
        justify="flex-start"
        className={classes.verticalBlock}
      >
        {labels.map((label) => (
          <Grid item key={label} className={classes.rowItem}>
            <Typography className={classes.label}>{label}</Typography>
          </Grid>
        ))}
      </Grid>
    </Grid>
    <Grid item>
      <Grid container direction="column" alignItems="flex-start" justify="flex-start">
        {values.map((value, index) => (
          <Grid item key={index} className={classes.rowItem}>
            {value}
          </Grid>
        ))}
      </Grid>
    </Grid>
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
        <div>
          <CircularProgressBar label="Revenue" value={0.25} />
        </div>
      </Grid>
      <Grid item xs={5}>
        <DataGrid
          labels={[
            translate(messages.performance),
            translate(messages.pledge),
            translate(messages.margins),
          ]}
          values={[
            <Typography key={0}>{formatPercent(data.performance)}</Typography>,
            <AdaValue key={1} value={data.pledge} />,
            <Typography key={2}>{formatPercent(data.margins)}</Typography>,
          ]}
        />
      </Grid>

      <Grid item xs={5}>
        <DataGrid
          labels={[
            translate(messages.createdAt),
            translate(messages.fullness),
            translate(messages.stake),
          ]}
          values={[
            <Typography key={0}>{formatTimestamp(data.createdAt)}</Typography>,
            <Typography key={1}>{formatPercent(data.fullness)}</Typography>,
            <AdaValue key={2} value={data.stake} />,
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

export default compose(withI18n)(StakePool)
