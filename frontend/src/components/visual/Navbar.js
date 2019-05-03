import React from 'react'
import cn from 'classnames'
import {Typography, withStyles, createStyles} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {fade} from '@material-ui/core/styles/colorManipulator'

import NavLink from '@/components/common/NavLink'
import {Tooltip} from '@/components/visual'

const styles = ({palette}) =>
  createStyles({
    list: {
      listStyleType: 'none',
    },
    item: {
      display: 'inline',
      margin: '5px',
      marginLeft: '40px',
    },
    link: {
      textDecoration: 'none',
    },
  })

const useDisabledLinkStyles = makeStyles(({palette}) => ({
  disabled: {
    pointerEvents: 'none',
    // TODO: not working without `important` but the classes seem to
    // be applied in the right order
    color: `${fade(palette.text.secondary, 0.5)}!important`,
  },
  disabledWrapper: {
    display: 'inline-block',
  },
}))

const DisabledLink = ({label, disabledText}) => {
  const classes = useDisabledLinkStyles()

  return (
    <Tooltip title={disabledText}>
      {/* Tooltip is not shown without this wrapper */}
      <div className={classes.disabledWrapper}>
        <NavTypography className={classes.disabled}>{label}</NavTypography>
      </div>
    </Tooltip>
  )
}

const Navbar = ({items = [], currentPathname, classes}) => (
  <nav>
    <ul className={classes.list}>
      {items.map(({link, label, disabledText}) => (
        <li key={label} className={classes.item}>
          {disabledText ? (
            <DisabledLink {...{label, disabledText}} />
          ) : (
            <NavLink className={classes.link} to={link}>
              {(isActive) => <NavTypography isActive={isActive}>{label}</NavTypography>}
            </NavLink>
          )}
        </li>
      ))}
    </ul>
  </nav>
)

const useNavTypographyStyles = makeStyles(({palette}) => ({
  linkText: {
    'color': palette.text.secondary,
    'fontSize': 14,
    'fontWeight': 'bold',
    'display': 'inline-block',
    'textTransform': 'uppercase',
    'position': 'relative',
    'letterSpacing': 1,
    '&:hover': {
      color: palette.primary.dark,
    },
  },
  active: {
    'color': palette.primary.main,
    '&:after': {
      content: '""',
      background: palette.tertiary.main,
      position: 'absolute',
      bottom: -5,
      left: 0,
      width: '50%',
      height: '1px',
    },
  },
}))

export const NavTypography = ({isActive, children, className}) => {
  const classes = useNavTypographyStyles()

  return (
    <Typography
      className={cn(classes.linkText, isActive && classes.active, className)}
      variant="body1"
    >
      {children}
    </Typography>
  )
}

export default withStyles(styles)(Navbar)
