// @flow
import React, {useCallback} from 'react'
import cn from 'classnames'
import useReactRouter from 'use-react-router'
import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'
import {fade} from '@material-ui/core/styles/colorManipulator'

import {routeTo} from '@/helpers/routes'
import {useI18n} from '@/i18n/helpers'
import {LiteTabs, LiteTab, MobileOnly, DesktopOnly} from '@/components/visual'
import useTabState from '@/components/hooks/useTabState'
import {NavbarLink} from '@/components/common/Navbar'
import {NavLink} from '@/components/common'

import config from '@/config'

import {ReactComponent as ListIcon} from '@/static/assets/icons/staking-simulator/list.svg'
import {ReactComponent as ComparisonMatrixIcon} from '@/static/assets/icons/staking-simulator/comparison-matrix.svg'
import {ReactComponent as HistoryIcon} from '@/static/assets/icons/staking-simulator/history.svg'
import {ReactComponent as ChartsIcon} from '@/static/assets/icons/staking-simulator/charts.svg'
import {ReactComponent as LocationIcon} from '@/static/assets/icons/staking-simulator/location.svg'
import {ReactComponent as PeopleIcon} from '@/static/assets/icons/staking-simulator/people.svg'

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
        'background': palette.background.paperContrast,
        'boxShadow': shadow,
        '& > *': {
          // This makes hover style the same as active, do we want that?
          color: palette.primary.main,
        },
      },
      'borderBottom': `1px solid ${palette.unobtrusiveContentHighlight}`,
    },
    active: {
      background: palette.background.paperContrast,
      color: palette.primary.main,
      boxShadow: shadow,
    },
    menuItemText: {
      paddingLeft: spacing(2),
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
      {icon}

      <NavbarLink className={classes.menuItemText} isActive={active}>
        {label}
      </NavbarLink>
    </Grid>
  )
}

const useNavigationBarStyles = makeStyles((theme) => ({
  href: {
    'textDecoration': 'none',
    '&:hover': {
      textDecoration: 'none',
    },
    'color': theme.palette.text.secondary,
  },
  // Note: parent can't have `overflow: hidden` and must span full height
  navBar: {
    top: 0,
    position: 'sticky',
  },
}))

type NavItems = Array<{|
  link: string,
  i18nLabel: string,
  icon: React$Node,
  id: string,
|}>

const NAV_ITEMS_IDS = {
  POOL_LIST: 'POOL_LIST',
  COMPARISON_MATRIX: 'COMPARISON_MATRIX',
  HISTORY: 'HISTORY',
  CHARTS: 'CHARTS',
  LOCATION: 'LOCATION',
  PEOPLE: 'PEOPLE',
}

const navItems: NavItems = [
  {
    link: routeTo.stakingCenter.poolList(),
    i18nLabel: navigationMessages.list,
    icon: <ListIcon color="inherit" />,
    id: NAV_ITEMS_IDS.POOL_LIST,
  },
  {
    link: routeTo.stakingCenter.poolComparison(),
    i18nLabel: navigationMessages.comparison,
    icon: <ComparisonMatrixIcon color="inherit" />,
    id: NAV_ITEMS_IDS.COMPARISON_MATRIX,
  },
  {
    link: routeTo.stakingCenter.history(),
    i18nLabel: navigationMessages.history,
    icon: <HistoryIcon color="inherit" />,
    id: NAV_ITEMS_IDS.HISTORY,
  },
  {
    link: routeTo.stakingCenter.charts(),
    i18nLabel: navigationMessages.charts,
    icon: <ChartsIcon color="inherit" />,
    id: NAV_ITEMS_IDS.CHARTS,
  },
  {
    link: routeTo.stakingCenter.location(),
    i18nLabel: navigationMessages.location,
    icon: <LocationIcon color="inherit" />,
    id: NAV_ITEMS_IDS.LOCATION,
  },
  {
    link: routeTo.stakingCenter.people(),
    i18nLabel: navigationMessages.people,
    icon: <PeopleIcon color="inherit" />,
    id: NAV_ITEMS_IDS.PEOPLE,
  },
].filter(({link}) => link)

const TAB_NAMES = navItems.filter(({link}) => link).map(({id}) => id)

const useTabStateFromUrl = () => {
  const {location} = useReactRouter()
  const initialTabName = navItems.find(({link}) => location.pathname === link)
  const tabState = useTabState(TAB_NAMES, initialTabName && initialTabName.id)
  return tabState
}

const getSideMenuNavLink = (linkId, link, location) => {
  if (config.isYoroi) {
    // only pool list url links to itself in yoroi
    const path = linkId === NAV_ITEMS_IDS.POOL_LIST ? link : config.seizaUrl + link
    return path + location.search
  } else {
    return link
  }
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
      // for yoroi, we must forbid tab navigation
      const link = getSideMenuNavLink(navItem.id, navItem.link, location)
      const pathChanged = location.pathname !== navItem.link
      if (config.isYoroi) {
        pathChanged && window.open(link, '_blank')
      } else {
        setTabByEventIndex(...args)
        pathChanged && history.push(link)
      }
    },
    [history, location, setTabByEventIndex]
  )

  return (
    <LiteTabs value={currentTabIndex} onChange={onChange}>
      {tabs.map(({id, label}) => (
        <LiteTab key={id} label={label} />
      ))}
    </LiteTabs>
  )
}

const DesktopNavigation = () => {
  const classes = useNavigationBarStyles()
  const {translate: tr} = useI18n()
  const {location} = useReactRouter()

  return (
    <div className={classes.navBar}>
      {navItems.map(({link, i18nLabel, icon, id}) => {
        return (
          <NavLink
            key={link}
            type={config.isYoroi && id !== NAV_ITEMS_IDS.POOL_LIST ? 'external' : 'internal'}
            to={getSideMenuNavLink(id, link, location)}
            target={config.isYoroi && id !== NAV_ITEMS_IDS.POOL_LIST ? '_blank' : '_self'}
            className={classes.href}
          >
            {(isActive) => <MenuItem active={isActive} label={tr(i18nLabel)} icon={icon} />}
          </NavLink>
        )
      })}
    </div>
  )
}

const NavigationBar = () => (
  <React.Fragment>
    <MobileOnly>
      <TabsHeader />
    </MobileOnly>
    <DesktopOnly className="h-100">
      <DesktopNavigation />
    </DesktopOnly>
  </React.Fragment>
)

export default NavigationBar
