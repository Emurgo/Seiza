// @flow
import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import cn from 'classnames'
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

const CustomAvatar = withStyles(({spacing, palette}) => ({
  root: {
    background: palette.background.paper,
    marginLeft: `${spacing(0.5)}px !important`,
    marginRight: spacing(0.5),
    // Needed, because on heroku styles are applied in different order
    width: `${spacing(4)}px !important`,
    height: `${spacing(4)}px !important`,
  },
}))(Avatar)

const CustomChip = withStyles(({palette, spacing}) => ({
  root: {
    background: fade(palette.primary.main, 0.1),
    border: 'none',
    color: palette.text.primary,
    height: 'auto',
    borderRadius: 1000,
    padding: spacing(0.5),
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

const useStyles = makeStyles(({spacing, palette}) => {
  const poolMargin = 4
  const poolHeight = 32 + poolMargin * 2
  const poolTransitionShift = 350
  return {
    stakePools: {
      width: '100%',
      overflow: 'hidden',
      marginTop: ({hasPoolsSelected}) => (hasPoolsSelected ? spacing(1) : 0),
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
    stakepoolWrapper: {
      marginBottom: spacing(1),
      marginTop: spacing(1),
    },
    clearIcon: {
      color: palette.text.secondary,
      marginLeft: spacing(1),
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
        deleteIcon={<Clear className={classes.clearIcon} />}
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
  const {translate: tr} = useI18n()
  return (
    <Grid container direction="row" alignItems="center">
      {selectedPools.length ? (
        <React.Fragment>
          <Typography color="textSecondary" variant="overline">
            {tr(messages.header)}
          </Typography>
          &nbsp;
          <Typography variant="overline">{selectedPools.length}</Typography>
        </React.Fragment>
      ) : (
        <Typography variant="overline" color="textSecondary">
          {tr(messages.noPools)}
        </Typography>
      )}
    </Grid>
  )
}

const PoolsToCompare = ({selectedPools}: Props) => {
  const classes = useStyles({hasPoolsSelected: selectedPools.length > 0})
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
            <div className={cn(classes.stakepoolWrapper, 'd-flex')} key={poolHash}>
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
