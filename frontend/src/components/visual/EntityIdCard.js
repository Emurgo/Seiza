import React from 'react'
import {Typography, Grid} from '@material-ui/core'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import {makeStyles} from '@material-ui/styles'
import cn from 'classnames'

import {Card} from '@/components/visual'
import {getDefaultSpacing} from '@/components/visual/ContentSpacing'
import CopyToClipboard from '@/components/common/CopyToClipboard'
import EllipsizeMiddle from '@/components/visual/EllipsizeMiddle'

const useStyles = makeStyles((theme) => ({
  cardContent: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: theme.spacing.unit * 2,
    overflow: 'hidden',
  },
  autoWidth: {
    width: 'auto',
  },
  iconAlign: {
    paddingRight: theme.spacing.unit * 2,
  },
}))

const useCardStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    // Note: we cannot use spaced prop on Card,
    // because it would break ellipsis
    paddingLeft: getDefaultSpacing(theme),
    paddingRight: getDefaultSpacing(theme),
    paddingBottom: getDefaultSpacing(theme) * 0.75,
    paddingTop: getDefaultSpacing(theme) * 0.75,
  },
}))

const EntityIdCard = ({
  iconRenderer,
  label,
  value,
  badge,
  showCopyIcon = true,
  rawValue,
  appearAnimation = false,
}) => {
  const cardClasses = useCardStyles()
  const classes = useStyles()

  return (
    <Card classes={cardClasses}>
      {iconRenderer && (
        <Grid
          container
          justify="center"
          alignItems="center"
          className={cn(classes.autoWidth, classes.iconAlign)}
        >
          <Grid item>{iconRenderer}</Grid>
        </Grid>
      )}
      <div item className={classes.cardContent}>
        <EntityCardContent {...{label, value, showCopyIcon, rawValue, appearAnimation}} />
      </div>
      {badge && (
        <Grid container justify="center" alignItems="center" className={classes.autoWidth}>
          <Grid item>{badge}</Grid>
        </Grid>
      )}
    </Card>
  )
}

const useContentStyles = makeStyles((theme) => ({
  wrapper: {
    cursor: 'initial',
    overflow: 'hidden',
    paddingTop: ({showCopyIcon}) => (showCopyIcon ? '12px' : 'initial'), // same value as in valueContainer's paddingBottom
  },
  valueContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingRight: ({showCopyIcon}) => (showCopyIcon ? '48px' : 'initial'), // width of copy to clipboard icon
    paddingBottom: ({showCopyIcon}) => (showCopyIcon ? '12px' : 'initial'), // because icon background hover would be cut :/
    position: 'relative',
  },
  copyToClipboard: {
    position: 'absolute',
    top: -12, // 1/4 of clipboard icon height to center
    right: 0,
  },
  value: {
    overflow: 'hidden',
    padding: ({appearAnimation}) => (appearAnimation ? theme.spacing.unit * (2 / 3) : 0),
  },
  correctureWrapper: {
    display: 'flex',
    overflow: 'hidden',
  },
  epochAppear: {
    borderRadius: 10,
    backgroundColor: theme.palette.secondary.main,
  },
  epochAppearActive: {
    transition: 'background-color 2s ease',
    backgroundColor: theme.palette.background.paper,
  },
  monospace: theme.typography._monospace,
}))

// Note: User is unable to select whole text at once
// due to cutting the text into different HTML elements
export const EntityCardContent = ({
  label,
  value = '',
  innerRef,
  showCopyIcon = true,
  rawValue,
  appearAnimation,
}) => {
  const classes = useContentStyles({showCopyIcon, appearAnimation})

  return (
    <div className={classes.correctureWrapper}>
      <div ref={innerRef} className={classes.wrapper}>
        <Typography variant="overline" color="textSecondary">
          {label}
        </Typography>

        <Grid item className={classes.valueContainer}>

          <ReactCSSTransitionGroup
            transitionName={{
              appear: classes.epochAppear,
              appearActive: classes.epochAppearActive,
            }}
            component={React.Fragment}
            transitionLeave={false}
            transitionEnter={false}
            transitionAppear={appearAnimation}
            transitionAppearTimeout={2000}
            key={rawValue}
          >
            <Typography variant="body1" className={cn(classes.value, classes.monospace)}>
              <EllipsizeMiddle value={value} />
            </Typography>
          </ReactCSSTransitionGroup>

          {showCopyIcon && (
            <div className={classes.copyToClipboard}>
              <CopyToClipboard value={rawValue || value} />
            </div>
          )}
        </Grid>
      </div>
    </div>
  )
}

export default EntityIdCard
