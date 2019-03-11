// @flow

import React from 'react'
import _ from 'lodash'
import gql from 'graphql-tag'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {IconButton, Grid, Chip, Typography, createStyles, withStyles} from '@material-ui/core'
import {defineMessages} from 'react-intl'
import {Share, CallMade, CallReceived} from '@material-ui/icons'

import {LoadingInProgress, DebugApolloError} from '@/components/visual'
import {withI18n} from '@/i18n/helpers'
import {withSelectedPoolsContext} from '../context'

const messages = defineMessages({
  header: 'Stake pools to compare:',
  share: 'Share',
  import: 'Import',
  export: 'Export',
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

const _StakePoolItem = ({classes, label, onDelete}) => (
  <React.Fragment>
    <Chip
      label={label}
      onClick={() => null}
      onDelete={onDelete}
      className={classes.chip}
      variant="outlined"
      color="primary"
    />
    {/* Hack to avoid displaying more chips in one line or in full width */}
    <div />
  </React.Fragment>
)

const StakePoolItem = withStyles(poolsStyles)(_StakePoolItem)

const Action = withStyles(poolsStyles)(({classes, label, Icon, onClick}) => (
  <Grid container direction="row" alignItems="center">
    <Typography className={classes.text}>{label}</Typography>
    <IconButton onClick={onClick} aria-label={label}>
      <Icon />
    </IconButton>
  </Grid>
))

const PoolsToCompare = ({
  classes,
  selectedPoolsContext: {removePool},
  i18n: {translate},
  poolsProvider: {loading, error, stakePools},
}) => {
  if (loading) return <LoadingInProgress />
  if (error) return <DebugApolloError error={error} />

  const sortedSelectedPools = _.sortBy(stakePools, (pool) => pool.name)

  return (
    <Grid container className={classes.wrapper} direction="row">
      <Grid container direction="row" alignItems="center" className={classes.header}>
        <Typography className={classes.text}>{translate(messages.header)}</Typography>&nbsp;
        <Typography>{sortedSelectedPools.length}</Typography>
      </Grid>
      <Grid className={classes.stakePools}>
        {sortedSelectedPools.map(({name, poolHash}) => (
          <StakePoolItem key={poolHash} label={name} onDelete={() => removePool(poolHash)} />
        ))}
      </Grid>
      {/* TODO: onClick handling and real work */}
      <Grid container direction="row" alignItems="center" justify="space-between" wrap="nowrap">
        <Grid item>
          <Action label={translate(messages.share)} Icon={Share} onClick={() => null} />
        </Grid>
        <Grid item>
          <Action label={translate(messages.import)} Icon={CallReceived} onClick={() => null} />
        </Grid>
        <Grid item>
          <Action label={translate(messages.export)} Icon={CallMade} onClick={() => null} />
        </Grid>
      </Grid>
    </Grid>
  )
}

// TODO: we may want some other strategy for getting pools names
export default compose(
  withI18n,
  withStyles(poolsStyles),
  withSelectedPoolsContext,
  graphql(
    gql`
      query($poolHashes: [String!]!) {
        stakePools(poolHashes: $poolHashes) {
          name
          poolHash
        }
      }
    `,
    {
      name: 'poolsProvider',
      options: (props) => ({
        variables: {poolHashes: props.selectedPoolsContext.selectedPools},
      }),
    }
  )
)(PoolsToCompare)
