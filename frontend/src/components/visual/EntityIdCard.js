import React from 'react'
import {Typography, Grid} from '@material-ui/core'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {fade} from '@material-ui/core/styles/colorManipulator'

import {makeStyles} from '@material-ui/styles'
import cn from 'classnames'

import {Card, ContentSpacing} from '@/components/visual'
import CopyToClipboard from '@/components/common/CopyToClipboard'

export const EntityCardShell = ({children}) => {
  return (
    <Card>
      <ContentSpacing bottom={0.75} top={0.75}>
        {children}
      </ContentSpacing>
    </Card>
  )
}

const EntityIdCard = (props) => {
  return (
    <EntityCardShell>
      <EntityCardContent {...props} />
    </EntityCardShell>
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
    top: -8,
    right: 0,
  },
  label: {
    // Needed so that `value` and `label` are aligned in case of animation
    marginLeft: theme.spacing(2 / 3),
  },
  value: {
    overflow: 'hidden',
    padding: theme.spacing(2 / 3),
  },
  correctureWrapper: {
    display: 'flex',
    overflow: 'hidden',
  },
  epochAppear: {
    borderRadius: 10,
    backgroundColor: fade(theme.palette.secondary.main, 0.1),
  },
  epochAppearActive: {
    transition: 'background-color 2s ease',
    backgroundColor: theme.palette.background.paper,
  },
  monospace: theme.typography._monospace,
  cardContent: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: theme.spacing(2),
    overflow: 'hidden',
  },
  autoWidth: {
    width: 'auto',
  },
  iconAlign: {
    paddingRight: theme.spacing(2),
  },
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
  iconRenderer,
  badge,
  ellipsizeValue = true,
  monospaceValue = true,
}) => {
  const classes = useContentStyles({showCopyIcon})

  return (
    <div className="d-flex">
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
      <div className={classes.cardContent}>
        <div className={classes.correctureWrapper}>
          <div ref={innerRef} className={classes.wrapper}>
            <Typography variant="overline" color="textSecondary" className={classes.label}>
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
                <Typography
                  noWrap={ellipsizeValue}
                  variant="body1"
                  className={cn(classes.value, monospaceValue && classes.monospace)}
                >
                  {value}
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
      </div>
      {badge && (
        <Grid container justify="center" alignItems="center" className={classes.autoWidth}>
          <Grid item>{badge}</Grid>
        </Grid>
      )}
    </div>
  )
}

export default EntityIdCard
