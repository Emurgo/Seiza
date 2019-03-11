// @flow

import React from 'react'
import _ from 'lodash'
import gql from 'graphql-tag'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {IconButton, Grid, Chip, Typography, createStyles, withStyles} from '@material-ui/core'
import {defineMessages} from 'react-intl'
import {Share, CallMade, CallReceived} from '@material-ui/icons'

import {LoadingDots, DebugApolloError} from '@/components/visual'
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

const Action = withStyles(poolsStyles)(({classes, label, icon, onClick}) => (
  <Grid container direction="row" alignItems="center">
    <Typography className={classes.text}>{label}</Typography>
    <IconButton onClick={onClick} aria-label={label}>
      {icon}
    </IconButton>
  </Grid>
))

const PoolsToCompare = ({
  classes,
  selectedPoolsContext: {removePool},
  i18n: {translate},
  poolsProvider: {loading, error, stakePools},
  selectedPoolsContext,
}) => {
  // TODO(ppershing): Is this the proper place to show loading errors?
  if (error) return <DebugApolloError error={error} />

  // TODO(ppershing): this is a hack until we figure out proper way of doing this in Apollo
  // TODO(ppershing): also, this means that reordering happens in the meantime. Hard to fix that
  // though...
  const allData = _.sortBy(stakePools || [], (pool) => pool.name).filter((pool) =>
    _.includes(selectedPoolsContext.selectedPools, pool.poolHash)
  )
  for (const hash of selectedPoolsContext.selectedPools) {
    if (allData.some((pool) => pool.poolHash === hash)) continue
    allData.push({poolHash: hash, name: null})
  }

  // End of hack

  return (
    <Grid container className={classes.wrapper} direction="row">
      <Grid container direction="row" alignItems="center" className={classes.header}>
        <Typography className={classes.text}>{translate(messages.header)}</Typography>&nbsp;
        <Typography>{allData.length}</Typography>
      </Grid>
      <Grid className={classes.stakePools}>
        {allData.map(({name, poolHash}) => (
          <StakePoolItem
            key={poolHash}
            label={name != null ? name : <LoadingDots />}
            onDelete={() => removePool(poolHash)}
          />
        ))}
      </Grid>
      {/* TODO: onClick handling and real work */}
      <Grid container direction="row" alignItems="center" justify="space-between" wrap="nowrap">
        <Grid item>
          <Action
            label={translate(messages.share)}
            icon={<Share color="primary" />}
            onClick={() => null}
          />
        </Grid>
        <Grid item>
          <Action
            label={translate(messages.import)}
            icon={<CallReceived color="primary" />}
            onClick={() => null}
          />
        </Grid>
        <Grid item>
          <Action
            label={translate(messages.export)}
            icon={<CallMade color="primary" />}
            onClick={() => null}
          />
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
