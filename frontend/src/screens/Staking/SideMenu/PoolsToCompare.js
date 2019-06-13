// @flow

import React from 'react'
import useReactRouter from 'use-react-router'
import gql from 'graphql-tag'
import {useApolloClient, useQuery} from 'react-apollo-hooks'
import {compose} from 'redux'
import {defineMessages} from 'react-intl'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {fade} from '@material-ui/core/styles/colorManipulator'

import {IconButton, Grid, Typography, Avatar, withStyles} from '@material-ui/core'
import {Share, CallMade, CallReceived, Clear} from '@material-ui/icons'

import {LoadingDots, DebugApolloError, VisualHash, Chip} from '@/components/visual'
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

const CustomChip = withStyles(({palette, spacing}) => ({
  root: {
    background: fade(palette.secondary.main, 0.2),
    border: 'none',
    color: palette.text.primary,
  },
  label: {
    maxWidth: '300px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'inline-block',
  },
  deleteIcon: {
    marginRight: spacing.unit,
    width: '0.7em',
  },
}))(Chip)

const poolsStyles = ({palette}) => {
  const poolMargin = 4
  const poolHeight = 32 + poolMargin * 2
  const poolTransitionShift = 350
  return {
    // Note: Keyframes not working without using `@global`
    '@global': {
      '@keyframes pool-leave': {
        '0%': {
          opacity: 1,
          left: 0,
          height: poolHeight,
        },
        '50%': {
          left: poolTransitionShift,
          opacity: 0,
          height: poolHeight,
        },
        '100%': {
          height: 0,
          opacity: 0,
          left: poolTransitionShift,
        },
      },
      '@keyframes pool-enter': {
        '0%': {
          opacity: 0,
          left: poolTransitionShift,
          height: 0,
        },
        '25%': {
          opacity: 0,
          left: poolTransitionShift,
          height: poolHeight,
        },
        '100%': {
          height: poolHeight,
          opacity: 1,
          left: 0,
        },
      },
    },
    'wrapper': {
      padding: '20px 40px 20px 60px',
      background: palette.background.paper,
      borderBottom: `1px solid ${palette.contentUnfocus}`,
    },
    'header': {
      paddingBottom: '15px',
    },
    'stakePools': {
      paddingBottom: '15px',
      width: '100%',
      overflow: 'hidden',
    },
    'chip': {
      // If set directly on `chipWrapper`, dimiss height transition is not smooth
      marginTop: poolMargin,
      marginBottom: poolMargin,
    },
    'chipWrapper': {
      height: poolHeight,
    },
    // Note: the `active` naming is common for CSSTransitionGroup
    // Note: all 4 classes must be supplied (otherwise not working)
    'poolAppear': {
      position: 'relative',
    },
    'poolAppearActive': {
      animation: 'pool-enter 600ms',
    },
    'poolLeave': {
      position: 'relative',
    },
    'poolLeaveActive': {
      animation: 'pool-leave 600ms',
    },
  }
}

const _StakePoolItem = ({classes, label, onDelete, hash}) => (
  <div className={classes.chipWrapper}>
    <CustomChip
      avatar={
        <CustomAvatar>
          <VisualHash value={hash} size={20} />
        </CustomAvatar>
      }
      className={classes.chip}
      label={label}
      onClick={() => null}
      onDelete={onDelete}
      deleteIcon={<Clear />}
      variant="outlined"
      color="primary"
    />
  </div>
)

const StakePoolItem = withStyles(poolsStyles)(_StakePoolItem)

const Action = withStyles(poolsStyles)(({classes, label, icon, onClick}) => (
  <Grid container direction="row" alignItems="center">
    <Typography className={classes.text}>{label}</Typography>
    <IconButton onClick={onClick} aria-label={label} color="primary">
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
        <ReactCSSTransitionGroup
          transitionName={{
            leave: classes.poolLeave,
            leaveActive: classes.poolLeaveActive,
            enter: classes.poolAppear,
            enterActive: classes.poolAppearActive,
          }}
          transitionAppear={false}
          transitionEnterTimeout={600}
          transitionLeaveTimeout={600}
          transitionLeave
          transitionEnter
        >
          {data.map(({name, poolHash}) => (
            <div className="d-flex" key={poolHash}>
              <StakePoolItem
                key={poolHash}
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
        </ReactCSSTransitionGroup>
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

export default compose(
  withI18n,
  withStyles(poolsStyles)
)(PoolsToCompare)
