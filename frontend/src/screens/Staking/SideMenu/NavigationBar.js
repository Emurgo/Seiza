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
import {LiteTabs, LiteTab, MobileOnly, DesktopOnly, Tooltip} from '@/components/visual'
import useTabState from '@/components/hooks/useTabState'
import {NavbarLink} from '@/components/common/Navbar'
import {NavLink} from '@/components/common'

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
  disabledText: 'Coming soon',
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
    comingSoon: {
      'background': palette.background.paper,
      'color': palette.contentUnfocus,
      '&:hover': {
        background: palette.background.paper,
        boxShadow: 'none',
      },
    },
    menuItemText: {
      paddingLeft: spacing(2),
    },
    comingSoonText: {
      color: palette.contentUnfocus,
    },
  }
})

const MenuItem = ({active, comingSoon, label, icon}) => {
  const classes = useMenuItemStyles()
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      className={cn(classes.link, active && classes.active, comingSoon && classes.comingSoon)}
    >
      {icon}

      <NavbarLink
        className={cn(classes.menuItemText, comingSoon && classes.comingSoonText)}
        isActive={active}
      >
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
  isComingSoon: boolean,
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
    isComingSoon: false,
  },
  {
    link: routeTo.stakingCenter.poolComparison(),
    i18nLabel: navigationMessages.comparison,
    icon: <ComparisonMatrixIcon color="inherit" />,
    id: NAV_ITEMS_IDS.COMPARISON_MATRIX,
    isComingSoon: true,
  },
  {
    link: routeTo.stakingCenter.history(),
    i18nLabel: navigationMessages.history,
    icon: <HistoryIcon color="inherit" />,
    id: NAV_ITEMS_IDS.HISTORY,
    isComingSoon: true,
  },
  {
    link: routeTo.stakingCenter.charts(),
    i18nLabel: navigationMessages.charts,
    icon: <ChartsIcon color="inherit" />,
    id: NAV_ITEMS_IDS.CHARTS,
    isComingSoon: true,
  },
  {
    link: routeTo.stakingCenter.location(),
    i18nLabel: navigationMessages.location,
    icon: <LocationIcon color="inherit" />,
    id: NAV_ITEMS_IDS.LOCATION,
    isComingSoon: true,
  },
  {
    link: routeTo.stakingCenter.people(),
    i18nLabel: navigationMessages.people,
    icon: <PeopleIcon color="inherit" />,
    id: NAV_ITEMS_IDS.PEOPLE,
    isComingSoon: true,
  },
].filter(({link}) => link)

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
      const pathChanged = location.pathname !== navItem.link
      pathChanged && history.push(navItem.link)
      setTabByEventIndex(...args)
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

  return (
    <div className={classes.navBar}>
      {navItems.map(({link, i18nLabel, icon, id, isComingSoon}) => {
        return isComingSoon ? (
          <Tooltip title={tr(navigationMessages.disabledText)} placement="bottom">
            {/* has to be wrapped in extra div to render properly */}
            <div>
              <MenuItem active={false} comingSoon label={tr(i18nLabel)} icon={icon} />
            </div>
          </Tooltip>
        ) : (
          <NavLink key={link} to={link} className={classes.href}>
            {(isActive) => (
              <MenuItem comingSoon={false} active={isActive} label={tr(i18nLabel)} icon={icon} />
            )}
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
