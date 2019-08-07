// @flow
import React from 'react'
import cn from 'classnames'
import MaterialButton from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/styles'
import {fade} from '@material-ui/core/styles/colorManipulator'

// not sure REFERENCE_GRADIENT is the best naming, it was copied from
// https://codepen.io/miraviolet/pen/ZobWEg and extracted to this constant here
const REFERENCE_GRADIENT = 'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))'

const useStyles = makeStyles((theme) => {
  return {
    root: {
      // Note(bigamasta): Next line fixes SSR for buttonGradient,
      // dunno why. We don't even pass any 'a'
      color: ({a}) => a,
      fontSize: theme.typography.fontSize * 0.9,
      paddingTop: theme.spacing(1.5),
      paddingBottom: theme.spacing(1.5),
    },
    rounded: {
      // Note: to have complete radius for all heights
      borderRadius: '1000px',
    },
    contained: {
      '&:hover': {
        background: fade(theme.palette.primary.main, 0.6),
      },
    },
    gradientContained: {
      'background': ({gradientDegree}) =>
        theme.palette.buttons.getContainedGradient(gradientDegree).background,
      'color': ({gradientDegree}) =>
        theme.palette.buttons.getContainedGradient(gradientDegree).textColor,
      'boxShadow': `0px 8px 20px ${fade(theme.palette.text.primary, 0.08)}`,
      '&:hover': {
        boxShadow: `0px 10px 30px ${fade(theme.palette.text.primary, 0.14)}`,
        // Note: this needs to be a gradient because otherwise some weird visual effects happen
        // Something is transitioning on the background and gradients to do not like to be
        // transitioned at all
        background: ({gradientDegree}) =>
          theme.palette.buttons.getContainedGradient(gradientDegree).hover,
      },
    },
    gradientOutlined: {
      // https://codepen.io/miraviolet/pen/ZobWEg
      'background': theme.palette.background.default,
      'color': ({gradientDegree}) =>
        theme.palette.buttons.getOutlinedGradient(gradientDegree).textColor,

      '&:hover': {
        backgroundImage: ({gradientDegree}) =>
          `${REFERENCE_GRADIENT}, ${
            theme.palette.buttons.getOutlinedGradient(gradientDegree).hover
          }`,
        color: ({gradientDegree}) =>
          theme.palette.buttons.getOutlinedGradient(gradientDegree).textHover,
      },
      'border': '1px solid transparent',
      'backgroundImage': ({gradientDegree}) =>
        `${REFERENCE_GRADIENT}, ${
          theme.palette.buttons.getOutlinedGradient(gradientDegree).background
        }`,
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
    disabledText: {
      color: `${fade(theme.palette.primary.main, 0.25)} !important`,
    },
    disabledContained: {
      background: `${fade(theme.palette.primary.main, 0.25)} !important`,
      color: `${theme.palette.background.default} !important`,
      boxShadow: 'none',
    },
    disabledOutlined: {
      borderColor: `${fade(theme.palette.primary.main, 0.25)} !important`,
      color: `${fade(theme.palette.primary.main, 0.25)} !important`,
      boxShadow: 'none',
    },
    disabledContainedGradient: {
      background: `${fade(theme.palette.primary.main, 0.25)} !important`,
      color: `${theme.palette.background.default} !important`,
      boxShadow: 'none',
    },
    disabledOutlinedGradient: {
      backgroundImage: ({gradientDegree}) => `${REFERENCE_GRADIENT},
      ${theme.palette.buttons.getOutlinedGradient(gradientDegree).hover}
    } !important`,
      color: `${theme.palette.primary.main} !important`,
      opacity: 0.25,
    },
  }
})

type ButtonProps = {
  +variant?: 'outlined' | 'contained' | 'text',
  +rounded?: boolean,
  +gradient?: boolean,
  +disabled?: boolean,
  +children: React$Node,
  +gradientDegree?: number,
  props?: Array<any>,
}

const Button = ({
  variant = 'text',
  rounded = false,
  gradient = false,
  disabled = false,
  gradientDegree = 90,
  children,
  ...props
}: ButtonProps) => {
  const classes = useStyles({rounded, gradientDegree})

  if (variant === 'text' && gradient) {
    // Note(bigamasta): text gradient combination is not used anywhere
    // in entire app, extend this if needed
    throw new Error('Text Button with gradient is not yet defined.')
  }
  return (
    <MaterialButton
      variant={variant}
      color="primary"
      disabled={disabled}
      classes={{
        root: cn(
          classes.root,
          rounded && classes.rounded,
          gradient && variant === 'contained' && classes.gradientContained,
          gradient && variant === 'outlined' && classes.gradientOutlined
        ),
        disabled: cn(
          disabled && variant === 'text' && classes.disabledText,
          disabled && variant === 'contained' && !gradient && classes.disabledContained,
          disabled && variant === 'outlined' && !gradient && classes.disabledOutlined,
          disabled && variant === 'contained' && gradient && classes.disabledContainedGradient,
          disabled && variant === 'outlined' && gradient && classes.disabledOutlinedGradient
        ),
        contained: classes.contained,
      }}
      {...props}
    >
      {children}
    </MaterialButton>
  )
}

export default Button
