// @flow

import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {defineMessages} from 'react-intl'
import {fade} from '@material-ui/core/styles/colorManipulator'
import {Grid, Typography, Avatar, withStyles} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {Clear} from '@material-ui/icons'

import {LoadingDots, VisualHash, Chip} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import {useSelectedPoolsContext} from '../../context/selectedPools'

const messages = defineMessages({
  header: 'Stake pools to compare:',
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
    marginRight: spacing(1),
    width: '0.7em',
  },
}))(Chip)

const useStyles = makeStyles(({palette}) => {
  const poolMargin = 4
  const poolHeight = 32 + poolMargin * 2
  const poolTransitionShift = 350
  return {
    header: {
      paddingBottom: '15px',
    },
    stakePools: {
      paddingBottom: '15px',
      width: '100%',
      overflow: 'hidden',
    },
    chip: {
      // If set directly on `chipWrapper`, dimiss height transition is not smooth
      marginTop: poolMargin,
      marginBottom: poolMargin,
    },
    chipWrapper: {
      height: poolHeight,
    },
    // Note: the `active` naming is common for CSSTransitionGroup
    poolAppear: {
      opacity: 0,
      left: poolTransitionShift,
      height: 0,
      position: 'relative',
    },
    poolAppearActive: {
      height: poolHeight,
      opacity: 1,
      left: 0,
      position: 'relative',
      transition: 'height 150ms, opacity 450ms ease 150ms, left 450ms ease 150ms',
    },
    poolLeave: {
      position: 'relative',
      opacity: 1,
      height: poolHeight,
      left: 0,
    },
    poolLeaveActive: {
      opacity: 0,
      height: 0,
      left: poolTransitionShift,
      transition: 'height 300ms ease 300ms, opacity 300ms, left 300ms',
    },
  }
})

const StakePoolItem = ({label, onDelete, hash}) => {
  const classes = useStyles()
  return (
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
}

type Props = {|
  selectedPools: Array<{name: string, poolHash: string}>,
|}

export const PoolsToCompareCount = ({selectedPools}: Props) => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  return (
    <Grid container direction="row" alignItems="center" className={classes.header}>
      {selectedPools.length ? (
        <React.Fragment>
          <Typography color="textSecondary" variant="overline">
            {tr(messages.header)}
          </Typography>
          &nbsp;
          <Typography variant="overline">{selectedPools.length}</Typography>
        </React.Fragment>
      ) : (
        <Typography variant="overline">{tr(messages.noPools)}</Typography>
      )}
    </Grid>
  )
}

const PoolsToCompare = ({selectedPools}: Props) => {
  const classes = useStyles()
  const {removePool} = useSelectedPoolsContext()

  return (
    <React.Fragment>
      <Grid container direction="column" className={classes.stakePools}>
        <ReactCSSTransitionGroup
          transitionName={{
            leave: classes.poolLeave,
            leaveActive: classes.poolLeaveActive,
            enter: classes.poolAppear,
            enterActive: classes.poolAppearActive,
          }}
          transitionAppear={false}
          // looks better when time is greater that transitions declare to take
          transitionEnterTimeout={1000}
          // looks better when time is greater that transitions declare to take
          transitionLeaveTimeout={1000}
          transitionLeave
          transitionEnter
        >
          {selectedPools.map(({name, poolHash}) => (
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
    </React.Fragment>
  )
}

export default PoolsToCompare
