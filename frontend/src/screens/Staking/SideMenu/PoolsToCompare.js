// @flow

import React from 'react'
import _ from 'lodash'
import useReactRouter from 'use-react-router'
import gql from 'graphql-tag'
import {useApolloClient, useQuery} from 'react-apollo-hooks'
import {compose} from 'redux'
import {defineMessages} from 'react-intl'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6

import {IconButton, Grid, Chip, Typography, withStyles} from '@material-ui/core'
import {Share, CallMade, CallReceived} from '@material-ui/icons'

import {LoadingDots, DebugApolloError} from '@/components/visual'
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
      '@keyframes pool-leave-2': {
        '0%': {
          opacity: 1,
          left: 0,
          height: poolHeight,
        },
        '100%': {
          height: 0,
          left: poolTransitionShift,
          opacity: 0,
        },
      },
      '@keyframes pool-leave-3': {
        '0%': {
          opacity: 1,
          height: poolHeight,
        },
        '100%': {
          height: 0,
          opacity: 0,
        },
      },
      '@keyframes pool-leave-4': {
        '0%': {
          opacity: 1,
          left: 0,
          height: poolHeight,
        },
        '50%': {
          left: 0,
          opacity: 0,
          height: poolHeight,
        },
        '100%': {
          height: 0,
          opacity: 0,
          left: 0,
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
      '@keyframes pool-enter-2': {
        '0%': {
          opacity: 0,
          left: poolTransitionShift,
          height: 0,
        },
        '100%': {
          height: poolHeight,
          opacity: 1,
          left: 0,
        },
      },
      '@keyframes pool-enter-3': {
        '0%': {
          left: 0,
          opacity: 0,
          height: 0,
        },
        '100%': {
          left: 0,
          height: poolHeight,
          opacity: 1,
        },
      },
      '@keyframes pool-enter-4': {
        '0%': {
          left: 0,
          opacity: 0,
          height: 0,
        },
        '50%': {
          left: 0,
          opacity: 0,
          height: poolHeight,
        },
        '100%': {
          left: 0,
          height: poolHeight,
          opacity: 1,
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
    'poolAppear': {
      opacity: '0.01',
      height: 0,
      left: '300px',
      position: 'relative',
    },
    'poolAppearActive': {
      animation: 'pool-enter 500ms',
    },
    'poolLeave': {
      opacity: '1',
      left: 0,
      overflow: 'hidden',
      position: 'relative',
      height: '32px',
    },
    'poolLeaveActive': {
      animation: 'pool-leave 600ms',
    },
  }
}

const _StakePoolItem = ({classes, label, onDelete}) => (
  <div className={classes.chipWrapper}>
    <Chip
      label={label}
      className={classes.chip}
      onClick={() => null}
      onDelete={onDelete}
      variant="outlined"
      color="primary"
    />
    {/* Hack to avoid displaying more chips in one line or in full width */}
    <div />
  </div>
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
  // TODO: simplify, always append next selected pool at the end of list
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

  // Note(ppershing): sorting nulls to the end
  const data = _(fragmentData)
    .map(([hash, poolData]) => ({
      poolHash: hash,
      name: poolData ? poolData.name : null,
    }))
    .sortBy((pool) => (pool.name ? `1${pool.name}` : '2'))
    .value()

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
      <Grid className={classes.stakePools}>
        <ReactCSSTransitionGroup
          transitionName={{
            leave: classes.poolLeave,
            leaveActive: classes.poolLeaveActive,
            enter: classes.poolAppear,
            enterActive: classes.poolAppearActive,
          }}
          transitionAppear={false}
          transitionLeave
          transitionEnter
        >
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

// TODO: we may want some other strategy for getting pools names
export default compose(
  withI18n,
  withStyles(poolsStyles)
)(PoolsToCompare)
