// @flow

import React from 'react'
import _ from 'lodash'
import gql from 'graphql-tag'
import {useApolloClient, useQuery} from 'react-apollo-hooks'
import {compose} from 'redux'
import {defineMessages} from 'react-intl'

import {IconButton, Grid, Chip, Typography, createStyles, withStyles} from '@material-ui/core'
import {Share, CallMade, CallReceived} from '@material-ui/icons'

import {LoadingDots, DebugApolloError} from '@/components/visual'
import assert from 'assert'
import {withI18n} from '@/i18n/helpers'
import {dataIdFromObject} from '@/helpers/apollo'
import {useSelectedPoolsContext} from '../context/selectedPools'

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

const PoolNamesFragment = gql`
  fragment PoolNamesFragment on BootstrapEraStakePool {
    poolHash
    name
  }
`

const PoolsToCompare = ({classes, i18n: {translate}}) => {
  const {removePool, selectedPools: poolHashes} = useSelectedPoolsContext()
  const client = useApolloClient()

  const fragmentData = poolHashes.map((hash) => {
    const id = dataIdFromObject({__typename: 'BootstrapEraStakePool', poolHash: hash})
    assert(id) // sanity check

    let data = null
    try {
      data = client.readFragment({id, fragment: PoolNamesFragment})
    } catch {
      // readFragment can throw. We do nothing in that case
    }

    return [hash, data]
  })

  const missing = fragmentData
    .filter(([hash, poolData]) => poolData == null)
    .map(([hash, poolData]) => hash)

  const skip = missing.length === 0

  // Note: we use data from fragments.
  // This query is just to fill the cache
  const {error} = useQuery(
    gql`
      query($poolHashes: [String!]!) {
        stakePools(poolHashes: $poolHashes) {
          ...PoolNamesFragment
        }
      }
      ${PoolNamesFragment}
    `,
    {
      variables: {poolHashes: missing},
      skip,
    }
  )

  if (missing.length && error) {
    return <DebugApolloError />
  }

  // Note(ppershing): sorting nulls to the end
  const data = _(fragmentData)
    .map(([hash, poolData]) => ({
      poolHash: hash,
      name: poolData ? poolData.name : null,
    }))
    .sortBy((pool) => (pool.name ? `1${pool.name}` : '2'))
    .value()

  return (
    <Grid container className={classes.wrapper} direction="row">
      <Grid container direction="row" alignItems="center" className={classes.header}>
        <Typography className={classes.text}>{translate(messages.header)}</Typography>&nbsp;
        <Typography>{data.length}</Typography>
      </Grid>
      <Grid className={classes.stakePools}>
        {data.map(({name, poolHash}) => (
          <StakePoolItem
            key={poolHash}
            label={
              name != null ? (
                name
              ) : (
                <span>
                  {poolHash.slice(0, 5)}
                  <LoadingDots />
                </span>
              )
            }
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
  withStyles(poolsStyles)
)(PoolsToCompare)
