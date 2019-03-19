// @flow
import React from 'react'
import classNames from 'classnames'
import MaterialButton from '@material-ui/core/Button'
import {withStyles, createStyles} from '@material-ui/core'
import {fade, darken} from '@material-ui/core/styles/colorManipulator'

const FADE_FACTOR = 0.6
const DARKEN_FACTOR = 0.1

const styles = (theme) => {
  const {
    start: gradientStart,
    end: gradientEnd,
    direction,
    endPercent,
    startPercent,
    gradient,
  } = theme.palette.buttonsGradient
  return createStyles({
    gradient: {
      'background-image': gradient,
      'color': theme.palette.getContrastText('#715BD3'),
      '&:hover': {
        backgroundImage: `linear-gradient(${direction}deg, ${fade(
          gradientStart,
          FADE_FACTOR
        )} ${startPercent}%, ${fade(gradientEnd, FADE_FACTOR)} ${endPercent}%)`,
      },
    },
    rounded: {
      // Note: to have complete radius for all heights
      borderRadius: '1000px',
    },
    secondary: {
      'border': `1px solid ${theme.palette.primary.main}`,
      'background': theme.palette.background.default,
      'color': theme.palette.primary.main,
      '&:hover': {
        background: darken(theme.palette.background.default, DARKEN_FACTOR),
      },
    },
    primary: {
      'background': theme.palette.primary.main,
      'color': theme.palette.getContrastText(theme.palette.primary.main),
      '&:hover': {
        background: fade(theme.palette.primary.main, FADE_FACTOR),
      },
    },
    disabled: {
      pointerEvents: 'none',
      opacity: 0.7,
    },
  })
}

const Button = ({
  gradient,
  rounded,
  secondary,
  primary,
  disabled,
  classes,
  className,
  ...props
}) => (
  <MaterialButton
    className={classNames({
      [classes.gradient]: gradient,
      [classes.rounded]: rounded,
      [classes.secondary]: secondary,
      [classes.primary]: primary,
      [classes.disabled]: disabled,
      [className]: className,
    })}
    {...props}
  />
)

export default withStyles(styles)(Button)
