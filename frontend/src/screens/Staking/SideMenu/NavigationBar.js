// @flow

import React, {useCallback} from 'react'
import cn from 'classnames'
import useReactRouter from 'use-react-router'
import {Typography, Grid} from '@material-ui/core'
import {Search, LocationOn, BarChart, History, Compare, People} from '@material-ui/icons'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'
import {fade} from '@material-ui/core/styles/colorManipulator'

import NavLink from '@/components/common/NavLink'
import {routeTo} from '@/helpers/routes'
import {useI18n} from '@/i18n/helpers'
import {useIsMobile} from '@/components/hooks/useBreakpoints'

import {LiteTabs, LiteTab} from '@/components/visual'
import useTabState from '@/components/hooks/useTabState'

const navigationMessages = defineMessages({
  list: 'Stake pools list',
  comparison: 'Comparison matrix',
  history: 'Stake pools history',
  charts: 'Charts',
  location: 'Location',
  people: 'People',
})

const useMenuItemStyles = makeStyles(({palette, spacing}) => {
  const shadow = `inset 0px 10px 20px -7px ${fade(palette.shadowBase, 0.12)}`
  return {
    link: {
      'background': palette.background.paper,
      'padding': '35px 40px 35px 60px',
      'textTransform': 'uppercase',
      '&:hover': {
        background: palette.background.paperContrast,
        boxShadow: shadow,
      },
      'borderBottom': `1px solid ${palette.unobtrusiveContentHighlight}`,
    },
    active: {
      background: palette.background.paperContrast,
      color: palette.primary.main,
      boxShadow: shadow,
    },
    icon: {
      paddingRight: spacing(2),
    },
  }
})

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
        <Typography>{label}</Typography>
      </Grid>
    </Grid>
  )
}

const useNavigationBarStyles = makeStyles((theme) => ({
  href: {
    textDecoration: 'none',
    color: theme.palette.text.secondary,
  },
  // Note: parent can't have `overflow: hidden` and must span full height
  navBar: {
    top: 0,
  },
  mobileNavBar: {
    top: 74, // TODO: change, keep in sync with main navigation bar height
    background: theme.palette.background.paper,
    zIndex: 1,
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    maxWidth: '100%',
  },
}))

type NavItems = Array<{|
  link: string,
  i18nLabel: string,
  icon: React$Node,
  id: string,
|}>

const navItems: NavItems = [
  {
    link: routeTo.stakingCenter.poolList(),
    i18nLabel: navigationMessages.list,
    icon: <Search color="inherit" />,
    id: 'POOL_LIST',
  },
  {
    link: routeTo.stakingCenter.poolComparison(),
    i18nLabel: navigationMessages.comparison,
    icon: <Compare color="inherit" />,
    id: 'COMPARISON_MATRIX',
  },
  {
    link: routeTo.stakingCenter.history(),
    i18nLabel: navigationMessages.history,
    icon: <History color="inherit" />,
    id: 'HISTORY',
  },
  {
    link: routeTo.stakingCenter.charts(),
    i18nLabel: navigationMessages.charts,
    icon: <BarChart color="inherit" />,
    id: 'CHARTS',
  },
  {
    link: routeTo.stakingCenter.location(),
    i18nLabel: navigationMessages.location,
    icon: <LocationOn color="inherit" />,
    id: 'LOCATION',
  },
  {
    link: routeTo.stakingCenter.people(),
    i18nLabel: navigationMessages.people,
    icon: <People color="inherit" />,
    id: 'PEOPLE',
  },
]

const TAB_NAMES = navItems.filter(({link}) => link).map(({id}) => id)

const useTabStateFromUrl = () => {
  const {location} = useReactRouter()
  const initialTabName = navItems.find(({link}) => location.pathname === link)
  const tabState = useTabState(TAB_NAMES, initialTabName && initialTabName.id)
  return tabState
}

const TabsHeader = () => {
  const {translate: tr} = useI18n()
  const {history, location} = useReactRouter()
  const {currentTabIndex, setTabByEventIndex} = useTabStateFromUrl()

  const tabs = navItems.map(({i18nLabel, id}) => ({id, label: tr(i18nLabel)}))

  const onChange = useCallback(
    (...args) => {
      // TODO: can we do better?
      const navItem = navItems[args[1]]
      setTabByEventIndex(...args)
      location.pathname !== navItem.link && history.push(navItem.link)
    },
    [history, location.pathname, setTabByEventIndex]
  )

  return (
    <LiteTabs defaultBottomOffset value={currentTabIndex} onChange={onChange}>
      {tabs.map(({id, label}) => (
        <LiteTab key={id} label={label} />
      ))}
    </LiteTabs>
  )
}

const MobileNavigation = () => {
  const classes = useNavigationBarStyles()

  return (
    <div className={cn(classes.mobileNavBar, 'sticky')}>
      <TabsHeader />
    </div>
  )
}

const DesktopNavigation = () => {
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

const NavigationBar = () => {
  const isMobile = useIsMobile()
  return isMobile ? <MobileNavigation /> : <DesktopNavigation />
}

export default NavigationBar
