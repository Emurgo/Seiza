// @flow

import React from 'react'
import classnames from 'classnames'
import {compose} from 'redux'
import {Typography, createStyles, withStyles, Grid} from '@material-ui/core'
import {Search, LocationOn, BarChart, History, Compare, People} from '@material-ui/icons'
import {defineMessages} from 'react-intl'

import NavLink from '@/components/common/NavLink'
import {routeTo} from '@/helpers/routes'
import {withI18n} from '@/i18n/helpers'

const navigationMessages = defineMessages({
  list: 'Stake pools list',
  comparison: 'Comparison matrix',
  history: 'Stake pools history',
  charts: 'Charts',
  location: 'Location',
  people: 'People',
})

const menuItemStyles = ({palette, spacing}) =>
  createStyles({
    link: {
      'background': palette.background.paper,
      'padding': '40px 40px 40px 60px',
      'textTransform': 'uppercase',
      '&:hover': {
        background: palette.background.default,
      },
      'borderBottom': `1px solid ${palette.grey[200]}`,
    },
    active: {
      background: palette.background.default,
    },
    activeText: {
      color: palette.primary.dark,
    },
    icon: {
      paddingRight: spacing.unit * 2,
    },
  })

const _MenuItem = ({classes, active, label, icon}) => (
  <Grid
    container
    direction="row"
    alignItems="center"
    className={classnames(classes.link, active && classes.active)}
  >
    <Grid item className={classes.icon}>
      {icon}
    </Grid>
    <Grid item>
      <Typography className={classnames(active && classes.activeText)}>{label}</Typography>
    </Grid>
  </Grid>
)

const MenuItem = withStyles(menuItemStyles)(_MenuItem)

const navigationBarStyles = createStyles({
  href: {
    textDecoration: 'none',
  },
})

const navItems = [
  {
    link: routeTo.staking.poolList(),
    i18nLabel: navigationMessages.list,
    icon: <Search color="primary" />,
  },
  {
    link: routeTo.staking.poolComparison(),
    i18nLabel: navigationMessages.comparison,
    icon: <Compare color="primary" />,
  },
  {
    link: routeTo.staking.history(),
    i18nLabel: navigationMessages.history,
    icon: <History color="primary" />,
  },
  {
    link: routeTo.staking.charts(),
    i18nLabel: navigationMessages.charts,
    icon: <BarChart color="primary" />,
  },
  {
    link: routeTo.staking.location(),
    i18nLabel: navigationMessages.location,
    icon: <LocationOn color="primary" />,
  },
  {
    link: routeTo.staking.people(),
    i18nLabel: navigationMessages.people,
    icon: <People color="primary" />,
  },
]

const NavigationBar = ({classes, i18n: {translate}}) =>
  navItems.map(({link, i18nLabel, icon}) => (
    <NavLink key={link} to={link} className={classes.href}>
      {(isActive) => <MenuItem active={isActive} label={translate(i18nLabel)} icon={icon} />}
    </NavLink>
  ))

export default compose(
  withStyles(navigationBarStyles),
  withI18n
)(NavigationBar)
