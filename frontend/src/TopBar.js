// @flow
import React, {useState, useCallback} from 'react'
import {withRouter} from 'react-router'
import {compose} from 'redux'
import {Grid, Grow, Card, Popper, ClickAwayListener, Divider} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {fade} from '@material-ui/core/styles/colorManipulator'
import cn from 'classnames'
import {routeTo} from './helpers/routes'

import Search from './screens/Blockchain/BlockchainHeader/Search'
import seizaLogoDesktop from './assets/icons/logo-seiza.svg'
import seizaLogoMobile from './assets/icons/seiza-symbol.svg'
import {NavLinks, MobileNavLinks} from '@/components/common/Navbar'
import {Link} from '@/components/visual'

import {useIsMobile} from '@/components/hooks/useBreakpoints'

import ArrowDownIcon from '@material-ui/icons/ArrowDropDown'
import LanguageSelect, {MobileLanguage} from '@/components/common/LanguageSelect'
import ThemeSelect from '@/components/common/ThemeSelect'

import config from '@/config'

const useTopBarStyles = makeStyles((theme) => ({
  topBar: {
    position: 'relative',
    background: theme.palette.background.paper,
    boxShadow: `0px 5px 25px ${fade(theme.palette.shadowBase, 0.12)}`,
    padding: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      padding: `${theme.spacing(1)}px ${theme.spacing(5)}px`,
    },
  },
  mobileSearch: {
    flex: 1,
    marginLeft: 0,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(2),
    },
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
    zIndex: 99999, // We just always want it to be on top
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
      <div>
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
                  <MobileNavLinks
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

const TopBar = compose(withRouter)(({location: {pathname}, navItems}) => {
  const classes = useTopBarStyles()
  const isMobile = useIsMobile()
  return !isMobile ? (
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
          <NavLinks currentPathname={pathname} items={navItems} />
          <LanguageSelect />
          {config.featureEnableThemes && <ThemeSelect />}
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <div className={cn(classes.topBar, 'd-flex')}>
      <MobileMenu currentPathname={pathname} items={navItems} />
      <div className={classes.mobileSearch}>
        <Search isMobile />
      </div>
    </div>
  )
})

export default TopBar
