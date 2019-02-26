import React from 'react'
import {Typography, withStyles, createStyles} from '@material-ui/core'
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
    },
    linkText: {
      'display': 'inline-block',
      'color': palette.getContrastText(palette.background.default),
      '&:hover': {
        color: palette.primary.dark,
      },
    },
    active: {color: palette.primary.dark, borderBottom: `1px solid ${palette.primary.dark}`},
  })

const Navbar = ({items = [], currentPathname, classes}) => (
  <nav>
    <ul className={classes.list}>
      {items.map(({link, label}) => (
        <li key={label} className={classes.item}>
          <NavLink className={classes.link} to={link}>
            {(isActive) => (
              <Typography
                className={classnames(classes.linkText, isActive && classes.active)}
                variant="body1"
              >
                {label}
              </Typography>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
)

export default withStyles(styles)(Navbar)
