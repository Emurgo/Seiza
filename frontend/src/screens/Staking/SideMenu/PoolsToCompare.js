// @flow

import React from 'react'
import useReactRouter from 'use-react-router'
import gql from 'graphql-tag'
import {useApolloClient, useQuery} from 'react-apollo-hooks'
import {compose} from 'redux'
import {defineMessages} from 'react-intl'

import {
  IconButton,
  Grid,
  Chip,
  Typography,
  Avatar,
  createStyles,
  withStyles,
} from '@material-ui/core'
import {Share, CallMade, CallReceived} from '@material-ui/icons'

import {LoadingDots, DebugApolloError, VisualHash} from '@/components/visual'
import CopyToClipboard from '@/components/common/CopyToClipboard'
import assert from 'assert'
import {withI18n} from '@/i18n/helpers'
import {dataIdFromObject} from '@/helpers/apollo'
import {useSelectedPoolsContext} from '../context/selectedPools'

const messages = defineMessages({
  header: 'Stake pools to compare:',
  share: 'Share',
  import: 'Import',
  export: 'Export',
  noPools: 'You have no pools to compare yet',
})

const CustomAvatar = withStyles({
  root: {
    background: 'transparent',
  },
})(Avatar)

const CustomChip = withStyles({
  root: {
    marginTop: '6px',
    marginBottom: '6px',
  },
  label: {
    maxWidth: '300px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'inline-block',
  },
})(Chip)

const poolsStyles = ({palette}) =>
  createStyles({
    wrapper: {
      padding: '20px 40px 20px 60px',
      background: palette.background.paper,
      borderBottom: `1px solid ${palette.contentUnfocus}`,
    },
    header: {
      paddingBottom: '15px',
    },
    stakePools: {
      paddingBottom: '15px',
    },
  })

const _StakePoolItem = ({classes, label, onDelete, hash}) => {
  return (
    <CustomChip
      avatar={
        <CustomAvatar>
          <VisualHash value={hash} size={20} />
        </CustomAvatar>
      }
      label={label}
      onClick={() => null}
      onDelete={onDelete}
      variant="outlined"
      color="primary"
    />
  )
}

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
  const {history, location} = useReactRouter()

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

  const data = fragmentData.map(([hash, poolData]) => ({
    poolHash: hash,
    name: poolData && poolData.name,
  }))

  // Note: not using `window.location.href` as then the component would not properly
  // listen to changes in url query
  const currentUrl = window.location.origin + history.createHref(location)

  return (
    <Grid container className={classes.wrapper} direction="row">
      <Grid container direction="row" alignItems="center" className={classes.header}>
        {data.length ? (
          <React.Fragment>
            <Typography variant="overline">{translate(messages.header)}</Typography>&nbsp;
            <Typography variant="overline">{data.length}</Typography>
          </React.Fragment>
        ) : (
          <Typography variant="overline">{translate(messages.noPools)}</Typography>
        )}
      </Grid>
      <Grid container direction="column" className={classes.stakePools}>
        {data.map(({name, poolHash}) => (
          <div className="d-flex" key={poolHash}>
            <StakePoolItem
              hash={poolHash}
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
            <div className="flex-grow-1" />
          </div>
        ))}
      </Grid>
      {/* TODO: onClick handling and real work */}
      <Grid container direction="row" alignItems="center" justify="space-between" wrap="nowrap">
        <Grid item>
          <Action
            label={translate(messages.share)}
            icon={
              <CopyToClipboard value={currentUrl}>
                <Share color="primary" />
              </CopyToClipboard>
            }
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
