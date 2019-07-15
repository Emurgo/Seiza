// @flow
import React from 'react'
import cn from 'classnames'

import {MenuList, MenuItem} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {fade} from '@material-ui/core/styles/colorManipulator'

import {NavTypography, NavLink as Link} from '@/components/common'
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
        <NavbarLink className={cn(classes.disabled, className)}>{label}</NavbarLink>
      </div>
    </Tooltip>
  )
}

const NavMenuItem = ({disabledText, label, link, isMobile}) => {
  const classes = useStyles()
  return !link ? (
    <DisabledLink {...{label, disabledText}} className={cn(isMobile && classes.mobileLink)} />
  ) : (
    <Link className={cn(classes.link, isMobile && classes.mobileLink)} to={link}>
      {(isActive) => (
        <NavbarLink
          isActive={isActive}
          className={!isMobile && isActive ? classes.underlineActive : ''}
        >
          {label}
        </NavbarLink>
      )}
    </Link>
  )
}

export type NavItem = {
  link: string,
  label: string,
  disabledText?: ?string,
}

type NavMenuItemsProps = {
  items: Array<NavItem>,
  currentPathname: string,
}

export const NavMenuItems = ({items = [], currentPathname}: NavMenuItemsProps) => {
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

const useNavbarLinkStyles = makeStyles(({palette}) => ({
  active: {
    color: palette.primary.main,
  },
  link: {
    '&:hover': {
      color: palette.primary.dark,
    },
  },
}))

// TODO: is there a better name for this component?
// Little ambiguity with NavLink
export const NavbarLink = ({
  isActive,
  children,
  className,
}: {
  isActive?: boolean,
  children: any,
  className?: string,
}) => {
  const classes = useNavbarLinkStyles()
  return (
    <NavTypography
      className={cn(classes.link, isActive && classes.active, className)}
      variant="body1"
    >
      {children}
    </NavTypography>
  )
}

export const MobileNavMenuItems = ({
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
