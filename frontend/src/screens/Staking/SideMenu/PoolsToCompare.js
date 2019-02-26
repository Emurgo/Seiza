// @flow

import React from 'react'
import {compose} from 'redux'
import {Grid, Chip, Typography, createStyles, withStyles} from '@material-ui/core'
import {defineMessages} from 'react-intl'

import {withI18n} from '@/i18n/helpers'

const I18N_PREFIX = 'staking.poolsToCompare'

const messages = defineMessages({
  header: {
    id: `${I18N_PREFIX}.header`,
    defaultMessage: 'Stake pools to compare:',
  },
  share: {
    id: `${I18N_PREFIX}.share`,
    defaultMessage: 'Share',
  },
  import: {
    id: `${I18N_PREFIX}.import`,
    defaultMessage: 'Import',
  },
  export: {
    id: `${I18N_PREFIX}.export`,
    defaultMessage: 'Export',
  },
})

const poolsStyles = ({palette}) =>
  createStyles({
    wrapper: {
      padding: '20px 40px 20px 60px',
      background: palette.background.paper,
      borderBottom: `1px solid ${palette.grey[200]}`,
    },
    header: {
      paddingBottom: '15px',
    },
    stakePools: {
      paddingBottom: '15px',
    },
    chip: {
      marginTop: '6px',
      marginBottom: '6px',
    },
    text: {
      textTransform: 'uppercase',
    },
  })

// TODO: implement handlers once there are real data
const _StakePoolItem = ({classes, label}) => (
  <React.Fragment>
    <Chip
      label={label}
      onClick={() => null}
      onDelete={() => null}
      className={classes.chip}
      variant="outlined"
      color="primary"
    />
    {/* Hack to avoid displaying more chips in one line or in full width */}
    <div />
  </React.Fragment>
)

const StakePoolItem = withStyles(poolsStyles)(_StakePoolItem)

const PoolsToCompare = ({stakePools, classes, i18n: {translate}}) => {
  return (
    <Grid container className={classes.wrapper}>
      <Grid container direction="row" alignItems="center" className={classes.header}>
        <Typography className={classes.text}>{translate(messages.header)}</Typography>&nbsp;
        <Typography>{stakePools.length}</Typography>
      </Grid>
      <Grid className={classes.stakePools}>
        {stakePools.map((pool, index) => (
          <StakePoolItem key={index} label={pool} />
        ))}
      </Grid>
      {/* TODO: icons */}
      <Grid container direction="row" alignItems="center" justify="space-between">
        <Typography className={classes.text}>{translate(messages.share)}</Typography>
        <Typography className={classes.text}>{translate(messages.import)}</Typography>
        <Typography className={classes.text}>{translate(messages.export)}</Typography>
      </Grid>
    </Grid>
  )
}

export default compose(
  withI18n,
  withStyles(poolsStyles)
)(PoolsToCompare)
