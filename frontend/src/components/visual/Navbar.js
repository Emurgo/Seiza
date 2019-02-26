import React from 'react'
import {Link} from 'react-router-dom'
import {Typography, withStyles, createStyles} from '@material-ui/core'
import classnames from 'classnames'

const styles = ({palette}) =>
  createStyles({
    list: {listStyleType: 'none'},
    item: {display: 'inline', margin: '5px', marginRight: '40px'},
    link: {textDecoration: 'none', textTransform: 'uppercase'},
    linkText: {display: 'inline-block', color: palette.getContrastText(palette.background.default)},
    active: {color: palette.primary.dark, borderBottom: `1px solid ${palette.primary.dark}`},
  })

// Note: as we do not except inner navigation, for simplicity we only check first level
const getFirstLevelUrl = (pathname) =>
  pathname
    .split('/')
    .slice(0, 2)
    .join('/')

const Navbar = ({items = [], currentPathname, classes}) => {
  const firstLevelPathname = getFirstLevelUrl(currentPathname)
  return (
    <nav>
      <ul className={classes.list}>
        {items.map(({link, label}) => (
          <li key={label} className={classes.item}>
            <Link className={classes.link} to={link}>
              <Typography
                className={classnames(
                  classes.linkText,
                  firstLevelPathname === link && classes.active
                )}
                variant="body1"
              >
                {label}
              </Typography>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default withStyles(styles)(Navbar)
