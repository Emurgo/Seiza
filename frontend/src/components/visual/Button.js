// @flow
import React from 'react'
import cn from 'classnames'
import MaterialButton from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/styles'
import {fade} from '@material-ui/core/styles/colorManipulator'

const FADE_FACTOR = 0.6
// not sure REFERENCE_GRADIENT is the best naming, it was copied from
// https://codepen.io/miraviolet/pen/ZobWEg and extracted to this constant here
const REFERENCE_GRADIENT = 'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))'

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: theme.typography.fontSize * 0.9,
    fontWeight: 700,
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
  },
  rounded: {
    // Note: to have complete radius for all heights
    borderRadius: '1000px',
  },
  primary: {
    'border': '1px solid transparent',
    'background': theme.palette.primary.main,
    'color': theme.palette.buttons.primary.textColor,
    '&:hover': {
      background: fade(theme.palette.primary.main, FADE_FACTOR),
    },
  },
  secondary: {
    'border': '1px solid transparent',
    'background': theme.palette.secondary.main,
    'color': theme.palette.buttons.secondary.textColor,
    '&:hover': {
      background: fade(theme.palette.secondary.main, FADE_FACTOR),
    },
  },
  primaryGradient: {
    'background': theme.palette.buttons.primaryGradient.background,
    'color': theme.palette.buttons.primaryGradient.textColor,
    'boxShadow': `0px 8px 20px ${fade(theme.palette.text.primary, 0.08)}`,
    '&:hover': {
      boxShadow: `0px 10px 30px ${fade(theme.palette.text.primary, 0.14)}`,
      // Note: this needs to be a gradient because otherwise some weird visual effects happen
      // Something is transitioning on the background and gradients to do not like to be
      // transitioned at all
      background: theme.palette.buttons.primaryGradient.hover,
    },
  },
  secondaryGradient: {
    // https://codepen.io/miraviolet/pen/ZobWEg
    'background': theme.palette.background.default,
    'color': theme.palette.buttons.secondaryGradient.textColor,

    '&:hover': {
      backgroundImage: `${REFERENCE_GRADIENT}, ${theme.palette.buttons.secondaryGradient.hover}`,
      color: theme.palette.buttons.secondaryGradient.textHover,
    },
    'border': '1px solid transparent',
    'backgroundImage': `${REFERENCE_GRADIENT}, ${theme.palette.buttons.secondaryGradient.background}`,
    'backgroundOrigin': 'border-box',
    'backgroundClip': 'content-box, border-box',
    'boxShadow': `2px 1000px 1px ${theme.palette.background.default} inset`,
    // :after is used only for proper shadow
    '&:after': {
      borderRadius: ({rounded}) => (rounded ? '1000px' : '4px'), // 4px is material-ui Button's default
      content: '""',
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: 'transparent',
      bottom: -1,
      right: 0,
      boxShadow: `0px 8px 20px ${fade(theme.palette.text.primary, 0.08)}`,
    },
    '&:hover:after': {
      boxShadow: `0px 10px 30px ${fade(theme.palette.text.primary, 0.14)}`,
    },
  },
  disabled: {
    background: `${fade(theme.palette.primary.main, 0.25)} !important`,
    color: `${theme.palette.background.default} !important`,
    boxShadow: 'none',
  },
  secondaryDisabled: {
    backgroundImage: `${REFERENCE_GRADIENT},
      ${theme.palette.buttons.hover}
    } !important`,
    color: `${theme.palette.primary.main} !important`,
    opacity: 0.35,
  },
}))

type ButtonProps = {
  +rounded?: boolean,
  +primary?: boolean,
  +secondary?: boolean,
  +primaryGradient?: boolean,
  +secondaryGradient?: boolean,
  +disabled?: boolean,
  +className?: string,
  +children: React$Node,
}

const Button = ({
  rounded,
  primary,
  secondary,
  primaryGradient,
  secondaryGradient,
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
        [classes.rounded]: rounded,
        [classes.primary]: primary,
        [classes.secondary]: secondary,
        [classes.primaryGradient]: primaryGradient,
        [classes.secondaryGradient]: secondaryGradient,
      })}
      classes={{
        disabled: cn(!secondary && classes.disabled, secondary && classes.secondaryDisabled),
      }}
      {...props}
    >
      {children}
    </MaterialButton>
  )
}

export default Button
