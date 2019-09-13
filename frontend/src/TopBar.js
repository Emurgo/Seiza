// @flow
import React from 'react'
import {Switch, Route} from 'react-router-dom'
import {matchPath} from 'react-router'
import useReactRouter from 'use-react-router'
import NoSSR from 'react-no-ssr'
import {Grid, Divider, SwipeableDrawer} from '@material-ui/core'
import {MoreVert as MenuIcon} from '@material-ui/icons'
import {makeStyles} from '@material-ui/styles'
import {fade} from '@material-ui/core/styles/colorManipulator'
import cn from 'classnames'

import {NAV_HEADER_HEIGHT} from '@/components/hooks/useScrollFromBottom'
import {useIsMobile} from '@/components/hooks/useBreakpoints'
import useBooleanState from '@/components/hooks/useBooleanState'
import {routeTo, combinedBlockchainPath} from './helpers/routes'
import BlockchainSearch from './screens/Blockchain/BlockchainHeader/Search'
import {useMobileStakingSettingsRef, useTopBarRef} from '@/components/context/refs'
import {Link} from '@/components/common'
import {NavMenuItems, MobileNavMenuItems} from '@/components/common/Navbar'
import LanguageSelect, {MobileLanguage} from '@/components/common/LanguageSelect'
import ThemeSelect from '@/components/common/ThemeSelect'
import {MobileOnly, DesktopOnly} from '@/components/visual'
import config from '@/config'

import seizaLogoDesktop from '@/static/assets/icons/logo-seiza.svg'
import seizaLogoMobile from '@/static/assets/icons/seiza-symbol.svg'

import type {NavItem} from '@/components/common/Navbar'

const useTopBarStyles = makeStyles((theme) => ({
  topBar: ({addShadow}) => ({
    position: 'relative',
    background: theme.palette.background.paper,
    boxShadow: addShadow ? `0px 5px 25px ${fade(theme.palette.shadowBase, 0.12)}` : 'none',
    padding: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      padding: `${theme.spacing(1)}px ${theme.spacing(5)}px`,
    },
    justifyContent: 'space-between',
    height: '100%',
  }),
  mobileSearch: {
    flex: 1,
    marginLeft: 0,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(2),
    },
  },
  stakingSettingsPortal: {
    position: 'relative',
    // Note: for portal flex positioning does not seem to work that good
    right: 25,
    top: 7,
  },

  navHeaderWrapper: {
    top: 0,
    zIndex: 30,
    position: 'sticky',
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  navHeaderWrapperHeight: {
    height: NAV_HEADER_HEIGHT,
  },
}))

const useMobileMenuStyles = makeStyles(({palette, spacing}) => ({
  mobileWrapper: {
    'display': 'flex',
    'alignItems': 'center',
    'cursor': 'pointer',
    // Fix 'blinking' effect on mobile
    '-webkit-tap-highlight-color': 'transparent',
  },
  mobileMenuWrapper: {
    padding: spacing(1),
  },
  languageWrapper: {
    padding: `${spacing(0.75)}px ${spacing(1.5)}px`,
  },
  dropdownIcon: {
    color: '#BFC5D2', // TODO: consider adding to theme
  },
  popper: {
    zIndex: 40,
  },
}))

const MobileMenu = ({items = [], currentPathname}: any) => {
  const classes = useMobileMenuStyles()
  const [isOpen, setIsOpen, setIsClosed] = useBooleanState(false)

  /* Note: not using IconButton as its hover does not look good when it wraps both icons,
     and also on mobile that hover will not be visible anyway. */
  return (
    <React.Fragment>
      <div className={classes.mobileWrapper} onClick={setIsOpen}>
        <img src={seizaLogoMobile} alt="logo" />
        <MenuIcon className={classes.dropdownIcon} />
      </div>
      {/* $FlowFixMe, flow complains about some Drawer props which are not used in examples */}
      <SwipeableDrawer
        open={isOpen}
        onClose={setIsClosed}
        disableBackdropTransition
        disableDiscovery
        onOpen={setIsOpen}
      >
        <div>
          <MobileNavMenuItems
            items={items}
            onClose={setIsClosed}
            currentPathname={currentPathname}
          />
          <Divider />
          <div className={classes.languageWrapper}>
            <MobileLanguage />
          </div>
          {config.featureEnableThemes && <ThemeSelect />}
        </div>
      </SwipeableDrawer>
    </React.Fragment>
  )
}

type TopBarContainerProps = {
  children: React$Node,
}

const TopBarContainer = ({children}: TopBarContainerProps) => {
  const isMobile = useIsMobile()
  const classes = useTopBarStyles()
  return (
    <Grid
      item
      className={cn(
        classes.navHeaderWrapper,
        (!config.isYoroi || isMobile) && classes.navHeaderWrapperHeight
      )}
    >
      {children}
    </Grid>
  )
}

type TopBarProps = {
  navItems: Array<NavItem>,
}
const TopBar = ({navItems}: TopBarProps) => {
  const {
    location: {pathname},
  } = useReactRouter()
  // Note: for stakingCenter there is next navigation below topBar which should not be affected
  // by shadow. It can not set higher z-index because when scrolling much it would overlap main
  // navigation what is not desired.
  const addShadow = !matchPath(pathname, routeTo.stakingCenter.home())
  const classes = useTopBarStyles({addShadow})
  const {callbackRef: mobileStakingSettingsRef} = useMobileStakingSettingsRef()
  const {callbackRef: topBarRef} = useTopBarRef()

  if (config.isYoroi) {
    return (
      <TopBarContainer>
        <div ref={topBarRef} />
      </TopBarContainer>
    )
  }

  return (
    <TopBarContainer>
      <DesktopOnly>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          className={classes.topBar}
        >
          <Grid item>
            <Link to={routeTo.home()}>
              <img alt="" src={seizaLogoDesktop} />
            </Link>
          </Grid>
          <Grid item>
            <Grid container direction="row" alignItems="center">
              <NavMenuItems currentPathname={pathname} items={navItems} />
              <LanguageSelect />
              {config.featureEnableThemes && <ThemeSelect />}
            </Grid>
          </Grid>
        </Grid>
      </DesktopOnly>
      <MobileOnly className="h-100">
        <div className={cn(classes.topBar, 'd-flex')}>
          <MobileMenu currentPathname={pathname} items={navItems} />
          {routeTo.stakingCenter.home() && (
            <NoSSR>
              <Switch>
                <Route path={routeTo.stakingCenter.home()}>
                  <NoSSR>
                    {/* Portal output */}
                    <div className={classes.stakingSettingsPortal} ref={mobileStakingSettingsRef} />
                  </NoSSR>
                </Route>
              </Switch>
            </NoSSR>
          )}
          {combinedBlockchainPath && (
            <Switch>
              <Route path={combinedBlockchainPath}>
                <div className={classes.mobileSearch}>
                  <NoSSR>
                    {/* Search uses portals and it doesn't like to be rendered on server */}
                    <BlockchainSearch isMobile />
                  </NoSSR>
                </div>
              </Route>
            </Switch>
          )}
        </div>
      </MobileOnly>
    </TopBarContainer>
  )
}

export default TopBar
