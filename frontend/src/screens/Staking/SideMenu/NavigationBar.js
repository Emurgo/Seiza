// @flow

import React from 'react'
import classnames from 'classnames'
import {compose} from 'redux'
import {Typography, createStyles, withStyles} from '@material-ui/core'
import {defineMessages} from 'react-intl'

import NavLink from '@/components/common/NavLink'
import {routeTo} from '@/helpers/routes'
import {withI18n} from '@/i18n/helpers'

const I18N_PREFIX = 'staking.navigation'

const navigationMessages = defineMessages({
  list: {
    id: `${I18N_PREFIX}.list`,
    defaultMessage: 'Stake pools list',
  },
  comparison: {
    id: `${I18N_PREFIX}.comparison`,
    defaultMessage: 'Comparison matric',
  },
  history: {
    id: `${I18N_PREFIX}.history`,
    defaultMessage: 'Stake pools history',
  },
  charts: {
    id: `${I18N_PREFIX}.charts`,
    defaultMessage: 'Charts',
  },
  location: {
    id: `${I18N_PREFIX}.location`,
    defaultMessage: 'Location',
  },
})

const menuItemStyles = ({palette}) =>
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
  })

// TODO: icon
const _MenuItem = ({classes, active, label}) => (
  <div className={classnames(classes.link, active && classes.active)}>
    <Typography className={classnames(active && classes.activeText)}>{label}</Typography>
  </div>
)

const MenuItem = withStyles(menuItemStyles)(_MenuItem)

const navigationBarStyles = createStyles({
  href: {
    textDecoration: 'none',
  },
})

const navItems = [
  {link: routeTo.staking.poolList(), i18nLabel: navigationMessages.list},
  {link: routeTo.staking.poolComparison(), i18nLabel: navigationMessages.comparison},
  {link: routeTo.staking.history(), i18nLabel: navigationMessages.history},
  {link: routeTo.staking.charts(), i18nLabel: navigationMessages.charts},
  {link: routeTo.staking.location(), i18nLabel: navigationMessages.location},
]

const NavigationBar = ({classes, i18n: {translate}}) =>
  navItems.map(({link, i18nLabel}) => (
    <NavLink key={link} to={link} className={classes.href}>
      {(isActive) => <MenuItem active={isActive} label={translate(i18nLabel)} />}
    </NavLink>
  ))

export default compose(
  withStyles(navigationBarStyles),
  withI18n
)(NavigationBar)
