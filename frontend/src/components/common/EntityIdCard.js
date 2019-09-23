import React from 'react'
import {Typography, Grid} from '@material-ui/core'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {fade} from '@material-ui/core/styles/colorManipulator'

import {makeStyles} from '@material-ui/styles'
import cn from 'classnames'

import {Card} from '@/components/visual'
import {CopyToClipboard, Ellipsize} from '@/components/common'
import {useIsMobile} from '@/components/hooks/useBreakpoints'

const useEntityCardShellStyles = makeStyles(({breakpoints, getContentSpacing}) => ({
  card: {
    paddingTop: getContentSpacing(0.25),
    paddingBottom: getContentSpacing(0.25),
    paddingLeft: getContentSpacing(0.5),
    paddingRight: getContentSpacing(0.5),
    [breakpoints.up('md')]: {
      paddingTop: getContentSpacing(0.75),
      paddingBottom: getContentSpacing(0.75),
      paddingLeft: getContentSpacing(),
      paddingRight: getContentSpacing(),
    },
  },
}))

export const EntityCardShell = ({children}) => {
  const classes = useEntityCardShellStyles()
  return <Card className={classes.card}>{children}</Card>
}

const EntityIdCard = (props) => {
  return (
    <EntityCardShell>
      <EntityCardContent {...props} />
    </EntityCardShell>
  )
}

const COPY_ICON_SPACING_CORRECTURE = 12

const useContentStyles = makeStyles((theme) => {
  const animationSpacing = theme.spacing(2 / 3)
  return {
    wrapper: {
      cursor: 'initial',
      overflow: 'hidden',
      paddingTop: COPY_ICON_SPACING_CORRECTURE,
      // remove spacing that's added because of animation when no icon is rendered
      marginLeft: ({iconRenderer}) => (!iconRenderer ? -animationSpacing : 'initial'),
    },
    valueContainer: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      paddingRight: ({showCopyIcon}) => (showCopyIcon ? '48px' : 'initial'), // width of copy to clipboard icon
      paddingBottom: COPY_ICON_SPACING_CORRECTURE, // because icon background hover would be cut :/
      position: 'relative',
    },
    copyToClipboard: {
      position: 'absolute',
      top: -8,
      right: 0,
    },
    label: {
      // Needed so that `value` and `label` are aligned in case of animation
      marginLeft: animationSpacing,
    },
    value: {
      overflow: 'hidden',
    },
    valueWrapper: {
      overflow: 'hidden',
      padding: animationSpacing,
      display: 'flex',
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
      [theme.breakpoints.up('md')]: {
        paddingRight: theme.spacing(2),
      },
      overflow: 'hidden',
      flex: 1,
    },
    autoWidth: {
      width: 'auto',
    },
    iconAlign: {
      // to have correct spacing around icon, we need to
      // remove spacing that's there because of animation
      paddingRight: theme.spacing(2) - animationSpacing,
    },
  }
})

export const DefaultEllipsizedEntity = ({value, monospace = true, className}) => {
  return (
    <Ellipsize
      value={value}
      xsCount={6}
      smCount={8}
      mdCount={10}
      lgCount="ellipsizeEnd"
      className={className}
    />
  )
}

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
  const isMobile = useIsMobile()
  const classes = useContentStyles({showCopyIcon, isMobile, iconRenderer})

  return (
    <div className="d-flex">
      {iconRenderer && (
        <Grid
          container
          justify="center"
          alignItems="center"
          className={cn(classes.autoWidth, classes.iconAlign)}
        >
          {iconRenderer}
        </Grid>
      )}
      <div className={classes.cardContent}>
        <div className={classes.correctureWrapper}>
          <div ref={innerRef} className={classes.wrapper}>
            {label && (
              <Typography
                component="div"
                variant="overline"
                color="textSecondary"
                className={classes.label}
              >
                {label}
              </Typography>
            )}

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
                {/* we need one child for ReactCSSTransitionGroup */}
                <div className={classes.valueWrapper}>
                  {ellipsizeValue ? (
                    <DefaultEllipsizedEntity
                      className={cn(classes.value, monospaceValue && classes.monospace)}
                      value={value}
                      monospace={monospaceValue}
                    />
                  ) : (
                    <span className={cn(classes.value, monospaceValue && classes.monospace)}>
                      {value}
                    </span>
                  )}
                </div>
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
