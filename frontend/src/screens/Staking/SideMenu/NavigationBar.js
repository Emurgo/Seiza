// @flow

import React from 'react'
import cn from 'classnames'
import {Typography, Grid} from '@material-ui/core'
import {Search, LocationOn, BarChart, History, Compare, People} from '@material-ui/icons'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import NavLink from '@/components/common/NavLink'
import {routeTo} from '@/helpers/routes'
import {useI18n} from '@/i18n/helpers'

const navigationMessages = defineMessages({
  list: 'Stake pools list',
  comparison: 'Comparison matrix',
  history: 'Stake pools history',
  charts: 'Charts',
  location: 'Location',
  people: 'People',
})

const useMenuItemStyles = makeStyles(({palette, spacing}) => ({
  link: {
    'background': palette.background.paper,
    'padding': '40px 40px 40px 60px',
    'textTransform': 'uppercase',
    '&:hover': {
      background: palette.background.paperContrast,
    },
    'borderBottom': `1px solid ${palette.unobtrusiveContentHighlight}`,
  },
  active: {
    background: palette.background.paperContrast,
  },
  activeText: {
    color: palette.primary.dark,
  },
  icon: {
    paddingRight: spacing.unit * 2,
  },
}))

const MenuItem = ({active, label, icon}) => {
  const classes = useMenuItemStyles()
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      className={cn(classes.link, active && classes.active)}
    >
      <Grid item className={classes.icon}>
        {icon}
      </Grid>
      <Grid item>
        <Typography className={cn(active && classes.activeText)}>{label}</Typography>
      </Grid>
    </Grid>
  )
}

const useNavigationBarStyles = makeStyles((theme) => ({
  href: {
    textDecoration: 'none',
  },
  // Note: parent can't have `overflow: hidden` and must span full height
  navBar: {
    top: 0,
  },
}))

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

const NavigationBar = () => {
  const classes = useNavigationBarStyles()
  const {translate: tr} = useI18n()

  return (
    <div className={cn(classes.navBar, 'sticky')}>
      {navItems.map(
        ({link, i18nLabel, icon}) =>
          link && (
            <NavLink key={link} to={link} className={classes.href}>
              {(isActive) => <MenuItem active={isActive} label={tr(i18nLabel)} icon={icon} />}
            </NavLink>
          )
      )}
    </div>
  )
}

export default NavigationBar
