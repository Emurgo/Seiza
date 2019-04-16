// @flow
import React from 'react'
import cn from 'classnames'
import MaterialButton from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/styles'
import {fade} from '@material-ui/core/styles/colorManipulator'

const FADE_FACTOR = 0.6

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
    'background': theme.palette.background.default,
    'color': theme.palette.primary.main,
    'borderRadius': ({rounded}) => (rounded ? '1000px' : null),
    '&:hover': {
      boxShadow: `0px 10px 30px ${fade(theme.palette.text.primary, 0.11)}`,
      background: theme.palette.background.default,
    },
    // eslint-disable-next-line
    // https://stackoverflow.com/questions/5706963/possible-to-use-border-radius-together-with-a-border-image-which-has-a-gradient
    '&:after': {
      position: 'absolute',
      top: '-1px',
      bottom: '-1px',
      left: '-1px',
      right: '-1px',
      background: theme.palette.buttonsGradient.normal,
      content: '""',
      zIndex: '-1', // Note: non-working when in modal
      borderRadius: ({rounded}) => (rounded ? '1000px' : '4px'), // 4px is material-ui Button's default
    },
    '&:hover:after': {
      background: theme.palette.buttonsGradient.hover,
    },
    '&:focus:after': {
      background: theme.palette.buttonsGradient.hover,
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
    background: `${fade(theme.palette.primary.main, 0.25)} !important`,
    color: `${theme.palette.background.default} !important`,
  },
  secondaryDisabled: {
    'background': 'transparent !important',
    'color': `${fade(theme.palette.primary.main, 0.35)} !important`,
    'border': `1px solid ${fade(theme.palette.primary.main, 0.35)}`,
    '&:after': {
      background: 'transparent',
    },
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
  const classes = useStyles({rounded})
  return (
    <MaterialButton
      disabled={disabled}
      className={cn(classes.root, className, {
        [classes.gradient]: gradient,
        [classes.rounded]: rounded,
        [classes.secondary]: secondary,
        [classes.primary]: primary,
      })}
      classes={{
        disabled: cn(classes.disabled, secondary && classes.secondaryDisabled),
      }}
      {...props}
    >
      {children}
    </MaterialButton>
  )
}

export default Button
