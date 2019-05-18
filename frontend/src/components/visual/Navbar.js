import React, {useState, useCallback} from 'react'
import cn from 'classnames'
import {
  Typography,
  Grow,
  Card,
  Popper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Divider,
} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {fade} from '@material-ui/core/styles/colorManipulator'
import ArrowDownIcon from '@material-ui/icons/ArrowDropDown'
import seizaLogo from '@/assets/icons/seiza-symbol.svg'

import {MobileLanguage} from '@/components/common/LanguageSelect'
import NavLink from '@/components/common/NavLink'
import {Tooltip} from '@/components/visual'

const useStyles = makeStyles(({palette, spacing}) => ({
  list: {
    listStyleType: 'none',
  },
  item: {
    display: 'inline',
    margin: '5px',
    marginRight: spacing.unit * 5,
  },
  link: {
    textDecoration: 'none',
  },
  mobileLink: {
    width: '100%',
    padding: `${spacing.unit}px ${spacing.unit * 2}px`,
  },
  menuItem: {
    padding: 0,
    height: '100%',
  },
  mobileWrapper: {
    'display': 'flex',
    'alignItems': 'center',
    'cursor': 'pointer',
    // Fix 'blinking' effect on mobile
    '-webkit-tap-highlight-color': 'transparent',
  },
  mobileMenuWrapper: {
    padding: spacing.unit,
  },
  languageWrapper: {
    padding: `${spacing.unit * 0.75}px ${spacing.unit * 1.5}px`,
  },
  dropdownIcon: {
    color: '#BFC5D2', // TODO: consider adding to theme
  },
}))

const useDisabledLinkStyles = makeStyles(({palette}) => ({
  disabled: {
    pointerEvents: 'none',
    // TODO: not working without `important` but the classes seem to
    // be applied in the right order
    color: `${fade(palette.text.secondary, 0.5)}!important`,
  },
  disabledWrapper: {
    display: 'inline-block',
  },
}))

const DisabledLink = ({label, disabledText, className}) => {
  const classes = useDisabledLinkStyles()

  return (
    <Tooltip title={disabledText}>
      {/* Tooltip is not shown without this wrapper */}
      <div className={classes.disabledWrapper}>
        <NavTypography className={cn(classes.disabled, className)}>{label}</NavTypography>
      </div>
    </Tooltip>
  )
}

const NavMenuItem = ({disabledText, label, link, isMobile}) => {
  const classes = useStyles()
  return disabledText ? (
    <DisabledLink {...{label, disabledText}} className={cn(isMobile && classes.mobileLink)} />
  ) : (
    <NavLink className={cn(classes.link, isMobile && classes.mobileLink)} to={link}>
      {(isActive) => <NavTypography {...{isActive, isMobile}}>{label}</NavTypography>}
    </NavLink>
  )
}

export const Navbar = ({items = [], currentPathname}) => {
  const classes = useStyles()
  return (
    <nav>
      <ul className={classes.list}>
        {items.map(({link, label, disabledText}) => (
          <li key={label} className={classes.item}>
            <NavMenuItem {...{disabledText, link, label}} />
          </li>
        ))}
      </ul>
    </nav>
  )
}

const useNavTypographyStyles = makeStyles(({palette}) => ({
  linkText: {
    'color': palette.text.secondary,
    'fontSize': 14,
    'fontWeight': 'bold',
    'display': 'inline-block',
    'textTransform': 'uppercase',
    'position': 'relative',
    'letterSpacing': 1,
    '&:hover': {
      color: palette.primary.dark,
    },
  },
  active: {
    'color': palette.primary.main,
    '&:after': {
      content: '""',
      background: palette.tertiary.main,
      position: 'absolute',
      bottom: -5,
      left: 0,
      width: '50%',
      height: '1px',
    },
  },
  activeMobile: {
    color: palette.primary.main,
  },
}))

export const NavTypography = ({isActive, children, className, isMobile}) => {
  const classes = useNavTypographyStyles()

  return (
    <Typography
      className={cn(
        classes.linkText,
        isActive && (isMobile ? classes.activeMobile : classes.active),
        className
      )}
      variant="body1"
    >
      {children}
    </Typography>
  )
}

export const MobileNavbar = ({items = [], currentPathname}) => {
  const classes = useStyles()
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

  return (
    <ClickAwayListener onClickAway={onClose}>
      {/* Note: not using IconButton as its hover does not look good when it wraps both icons,
          and also on mobile that hover will not be visible anyway. */}
      <div className={classes.mobileWrapper} onClick={onClick}>
        <img src={seizaLogo} alt="logo" />
        <ArrowDownIcon className={classes.dropdownIcon} />
      </div>
      {isOpen && (
        <Popper open={isOpen} anchorEl={anchorEl} transition placement="bottom-end">
          {({TransitionProps}) => (
            <Grow {...TransitionProps}>
              <Card classes={{root: classes.mobileMenuWrapper}}>
                <MenuList>
                  {items.map(({link, label, disabledText}) => (
                    <MenuItem
                      key={label}
                      disabled={disabledText}
                      onClick={onClose}
                      className={classes.menuItem}
                    >
                      <NavMenuItem {...{disabledText, link, label}} isMobile />
                    </MenuItem>
                  ))}
                </MenuList>
                <Divider />
                <div className={classes.languageWrapper}>
                  <MobileLanguage />
                </div>
              </Card>
            </Grow>
          )}
        </Popper>
      )}
    </ClickAwayListener>
  )
}
