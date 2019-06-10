// @flow
import React from 'react'
import {withRouter} from 'react-router'
import {compose} from 'redux'
import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {fade} from '@material-ui/core/styles/colorManipulator'
import cn from 'classnames'
import {routeTo} from './helpers/routes'

import Search from './screens/Blockchain/BlockchainHeader/Search'
import seizaLogo from './assets/icons/logo-seiza.svg'
import {Navbar, MobileNavbar, Link} from './components/visual'

import LanguageSelect from '@/components/common/LanguageSelect'
import ThemeSelect from '@/components/common/ThemeSelect'

import {useIsMobile} from '@/components/hooks/useBreakpoints'
import config from './config'

const useAppStyles = makeStyles((theme) => ({
  topBar: {
    position: 'relative',
    background: theme.palette.background.paper,
    boxShadow: `0px 5px 25px ${fade(theme.palette.shadowBase, 0.12)}`,
    padding: theme.spacing.unit,
    [theme.breakpoints.up('sm')]: {
      padding: `${theme.spacing.unit}px ${theme.spacing.unit * 5}px`,
    },
  },
  mobileSearch: {
    flex: 1,
    marginLeft: 0,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 2,
    },
  },
}))

const TopBar = compose(withRouter)(({location: {pathname}, navItems}) => {
  const classes = useAppStyles()
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
          <img alt="" src={seizaLogo} />
        </Link>
      </Grid>
      <Grid item>
        <Grid container direction="row" alignItems="center">
          <Navbar currentPathname={pathname} items={navItems} />
          <LanguageSelect />
          {config.featureEnableThemes && <ThemeSelect />}
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <div className={cn(classes.topBar, 'd-flex')}>
      <MobileNavbar currentPathname={pathname} items={navItems} />
      <div className={classes.mobileSearch}>
        <Search isMobile />
      </div>
    </div>
  )
})

export default TopBar
