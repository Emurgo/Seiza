// @flow
import React, {useState, useCallback} from 'react'
import {Switch, Route} from 'react-router-dom'
import {matchPath} from 'react-router'
import useReactRouter from 'use-react-router'
import NoSSR from 'react-no-ssr'
import {Grid, Grow, Card, Popper, ClickAwayListener, Divider} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {fade} from '@material-ui/core/styles/colorManipulator'
import ArrowDownIcon from '@material-ui/icons/ArrowDropDown'
import cn from 'classnames'

import {routeTo, combinedBlockchainPath} from './helpers/routes'
import BlockchainSearch from './screens/Blockchain/BlockchainHeader/Search'
import {useMobileStakingSettingsRef} from '@/components/context/refs'
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
    padding: `0px ${spacing(1.5)}px`,
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
  const [isOpen, setIsOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const onClose = useCallback(() => {
    // Note: this is hack
    // Without `setTimeout` click event is not "propagated" to Link
    // TODO: investigate if we can do better
    setTimeout(() => setIsOpen(false), 500)
  }, [setIsOpen])

  const onClick = useCallback(
    (event) => {
      !anchorEl && setAnchorEl(event.currentTarget)
      setIsOpen(!isOpen)
    },
    [setIsOpen, anchorEl, setAnchorEl, isOpen]
  )

  /* Note: not using IconButton as its hover does not look good when it wraps both icons,
     and also on mobile that hover will not be visible anyway. */
  return (
    <ClickAwayListener onClickAway={onClose}>
      {/* Note: <div> is required by ClickAwayListener as it needs a component
          that can directly cary a ref */}
      <div style={{display: 'inline-block'}}>
        <div className={classes.mobileWrapper} onClick={onClick}>
          <img src={seizaLogoMobile} alt="logo" />
          <ArrowDownIcon className={classes.dropdownIcon} />
        </div>
        {isOpen && (
          <Popper
            open={isOpen}
            anchorEl={anchorEl}
            transition
            placement="bottom-end"
            className={classes.popper}
          >
            {({TransitionProps}) => (
              <Grow {...TransitionProps}>
                <Card classes={{root: classes.mobileMenuWrapper}}>
                  <MobileNavMenuItems
                    items={items}
                    onClose={onClose}
                    currentPathname={currentPathname}
                  />
                  <Divider />
                  <div className={classes.languageWrapper}>
                    <MobileLanguage />
                  </div>
                  {config.featureEnableThemes && <ThemeSelect />}
                </Card>
              </Grow>
            )}
          </Popper>
        )}
      </div>
    </ClickAwayListener>
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

  return (
    <React.Fragment>
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
      <MobileOnly>
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
    </React.Fragment>
  )
}

export default TopBar
