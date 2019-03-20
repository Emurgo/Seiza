import React from 'react'
import {Typography, withStyles, createStyles} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import classnames from 'classnames'

import NavLink from '@/components/common/NavLink'

const styles = ({palette}) =>
  createStyles({
    list: {
      listStyleType: 'none',
    },
    item: {
      display: 'inline',
      margin: '5px',
      marginRight: '40px',
    },
    link: {
      textDecoration: 'none',
      textTransform: 'uppercase',
      position: 'relative',
    },
  })

const Navbar = ({items = [], currentPathname, classes}) => (
  <nav>
    <ul className={classes.list}>
      {items.map(({link, label}) => (
        <li key={label} className={classes.item}>
          <NavLink className={classes.link} to={link}>
            {(isActive) => <NavTypography isActive={isActive}>{label}</NavTypography>}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
)

const useNavTypographyStyles = makeStyles(({palette}) => ({
  linkText: {
    'fontSize': 14,
    'fontWeight': 'bold',
    'display': 'inline-block',
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
      className={classnames(classes.linkText, isActive && classes.active, className)}
      variant="body1"
      color="textSecondary"
    >
      {children}
    </Typography>
  )
}

export default withStyles(styles)(Navbar)
