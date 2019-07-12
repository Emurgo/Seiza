// @flow
import React from 'react'
import cn from 'classnames'

import {Typography, MenuList, MenuItem} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {fade} from '@material-ui/core/styles/colorManipulator'

import NavLink from '@/components/common/NavLink'
import {Tooltip} from '@/components/visual'

const useStyles = makeStyles(({palette, spacing}) => ({
  list: {
    listStyleType: 'none',
  },
  item: {
    display: 'inline',
    margin: '5px',
    marginRight: spacing(5),
  },
  link: {
    textDecoration: 'none',
  },
  mobileLink: {
    width: '100%',
    padding: `${spacing(1)}px ${spacing(2)}px`,
  },
  menuItem: {
    padding: 0,
    height: '100%',
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
  return !link ? (
    <DisabledLink {...{label, disabledText}} className={cn(isMobile && classes.mobileLink)} />
  ) : (
    <NavLink className={cn(classes.link, isMobile && classes.mobileLink)} to={link}>
      {(isActive) => (
        <NavTypography underlineActive={!isMobile} {...{isActive}}>
          {label}
        </NavTypography>
      )}
    </NavLink>
  )
}

export type NavItem = {
  link: string,
  label: string,
  disabledText?: ?string,
}

type NavLinksProps = {
  items: Array<NavItem>,
  currentPathname: string,
}

export const NavLinks = ({items = [], currentPathname}: NavLinksProps) => {
  const classes = useStyles()
  return (
    <nav>
      <ul className={classes.list}>
        {items.map(({link, label, disabledText}) => (
          <li key={label} className={classes.item}>
            <NavMenuItem isMobile={false} {...{disabledText, link, label}} />
          </li>
        ))}
      </ul>
    </nav>
  )
}

const useNavTypographyStyles = makeStyles(({palette}) => ({
  linkText: {
    color: palette.text.secondary,
    fontSize: 14,
    fontWeight: 'bold',
    display: 'inline-block',
    textTransform: 'uppercase',
    position: 'relative',
    letterSpacing: 1,
  },
  linkTextHover: {
    '&:hover': {
      color: palette.primary.dark,
    },
  },
  active: {
    color: palette.primary.main,
  },
  underlineActive: {
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
}))

// TODO: Make NavTypography dumb component
// but merge #811 first to avoid conflicts
export const NavTypography = ({
  isActive,
  children,
  className,
  underlineActive = false,
  hasHoverStyled = true, // Temporary, see TODO above,
}: {
  isActive?: boolean,
  children: any,
  className?: string,
  underlineActive?: boolean,
  hasHoverStyled?: boolean,
}) => {
  const classes = useNavTypographyStyles()
  return (
    <Typography
      className={cn(
        classes.linkText,
        isActive && classes.active,
        isActive && underlineActive && classes.underlineActive,
        hasHoverStyled && classes.linkTextHover,
        className
      )}
      variant="body1"
    >
      {children}
    </Typography>
  )
}

export const MobileNavLinks = ({
  onClose,
  items,
  currentPathname,
}: {
  onClose: () => any,
  items: Array<NavItem>,
  currentPathname: string,
}) => {
  const classes = useStyles()
  return (
    <MenuList>
      {items.map(({link, label, disabledText}) => (
        <MenuItem key={label} disabled={!link} onClick={onClose} className={classes.menuItem}>
          <NavMenuItem {...{disabledText, link, label}} isMobile />
        </MenuItem>
      ))}
    </MenuList>
  )
}
