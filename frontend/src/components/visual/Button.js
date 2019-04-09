// @flow
import React from 'react'
import classNames from 'classnames'
import MaterialButton from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/styles'
import {fade, darken} from '@material-ui/core/styles/colorManipulator'

const FADE_FACTOR = 0.6
const DARKEN_FACTOR = 0.1

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: theme.typography.fontSize * 0.9,
    fontWeight: 700,
    paddingTop: theme.spacing.unit * 1.5,
    paddingBottom: theme.spacing.unit * 1.5,
    letterSpacing: 1,
  },
  gradient: {
    'background': theme.palette.buttonsGradient.normal,
    'color': theme.palette.getContrastText('#715BD3'),
    '&:hover': {
      background: theme.palette.buttonsGradient.hover,
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
    'border': '1px solid transparent',
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
}))

type ButtonProps = {
  +gradient?: boolean,
  +rounded?: boolean,
  +secondary?: boolean,
  +primary?: boolean,
  +disabled?: boolean,
  +className?: string,
  +children: React$Node,
}

const Button = ({
  gradient,
  rounded,
  secondary,
  primary,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) => {
  const classes = useStyles()
  return (
    <MaterialButton
      className={classNames(classes.root, className, {
        [classes.gradient]: gradient,
        [classes.rounded]: rounded,
        [classes.secondary]: secondary,
        [classes.primary]: primary,
        [classes.disabled]: disabled,
      })}
      {...props}
    >
      {children}
    </MaterialButton>
  )
}

export default Button
