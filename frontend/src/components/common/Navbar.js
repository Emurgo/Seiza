// @flow
import React from 'react'
import cn from 'classnames'

import {MenuList, MenuItem, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {fade} from '@material-ui/core/styles/colorManipulator'

import {NavTypography, NavLink as Link} from '@/components/common'
import {Tooltip, Card} from '@/components/visual'

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
  disabledEvents: {
    pointerEvents: 'none',
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

const useNavbarLinkStyles = makeStyles(({palette}) => ({
  active: {
    color: `${palette.primary.main}!important`, // Yes, this is needed
  },
  link: {
    '&:hover': {
      color: palette.primary.dark,
    },
  },
}))

const useSublinksStyles = makeStyles((theme) => ({
  tooltipChildren: {
    display: 'inline-block',
  },
  linkText: {
    color: theme.palette.text.secondary,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  link: {
    textDecoration: 'none',
  },
  menuItem: {
    padding: 0,
    minHeight: 0,
  },
}))

const useTooltipClasses = makeStyles((theme) => ({
  tooltip: {
    borderRadius: '10px',
    padding: 0,
  },
}))

const Sublink = ({children, to}) => {
  const sublinkClasses = useSublinksStyles()
  const navBarClasses = useNavbarLinkStyles()
  return (
    <Link to={to} className={sublinkClasses.link}>
      {(isActive) => (
        <Typography
          variant="body1"
          className={cn(
            navBarClasses.link,
            sublinkClasses.linkText,
            isActive && navBarClasses.active
          )}
        >
          {children}
        </Typography>
      )}
    </Link>
  )
}

const Sublinks = ({sublinks}) => {
  const classes = useSublinksStyles()
  return (
    <Card>
      <MenuList>
        {sublinks.map(({link, label}) => (
          <MenuItem key={link} className={classes.menuItem}>
            <Sublink to={link}>{label}</Sublink>
          </MenuItem>
        ))}
      </MenuList>
    </Card>
  )
}

const WithSublinks = ({children, sublinks}) => {
  const classes = useSublinksStyles()
  const tooltipClasses = useTooltipClasses()
  if (!sublinks) return children

  const PopoverMenu = Tooltip

  return (
    <PopoverMenu
      classes={tooltipClasses}
      placement="bottom"
      interactive
      title={<Sublinks sublinks={sublinks} />}
      disableFocusListener
    >
      <div className={classes.tooltipChildren}>{children}</div>
    </PopoverMenu>
  )
}

type SublinksType = Array<{link: string, label: string}>

type NavMenuItemProps = {
  disabledText?: ?string,
  label: string,
  link: ?string,
  isMobile: boolean,
  sublinks?: SublinksType,
  getIsActive?: Function,
}

const NavMenuItem = ({
  disabledText,
  label,
  link,
  isMobile,
  sublinks,
  getIsActive,
}: NavMenuItemProps) => {
  const classes = useStyles()
  return !link ? (
    <DisabledLink {...{label, disabledText}} className={cn(isMobile && classes.mobileLink)} />
  ) : (
    <WithSublinks sublinks={sublinks}>
      <Link
        getIsActive={getIsActive}
        className={cn(
          classes.link,
          isMobile && classes.mobileLink,
          sublinks && classes.disabledEvents
        )}
        to={link}
      >
        {(isActive) => (
          <NavbarLink
            isActive={isActive}
            className={!isMobile && isActive ? classes.underlineActive : ''}
          >
            {label}
          </NavbarLink>
        )}
      </Link>
    </WithSublinks>
  )
}

export type NavItem = {
  link: string,
  label: string,
  disabledText?: ?string,
  sublinks?: SublinksType,
  getIsActive?: Function,
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
        {items.map(({link, label, disabledText, sublinks, getIsActive}) => (
          <li key={label} className={classes.item}>
            <NavMenuItem isMobile={false} {...{disabledText, link, label, sublinks, getIsActive}} />
          </li>
        ))}
      </ul>
    </nav>
  )
}

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

const MobileMenuItem = ({label, link, onClose, disabledText}) => {
  const classes = useStyles()
  return (
    <MenuItem key={label} disabled={!link} onClick={onClose} className={classes.menuItem}>
      <NavMenuItem {...{disabledText, link, label}} isMobile />
    </MenuItem>
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
}) => (
  <MenuList>
    {items.map(({link, label, disabledText, sublinks}) =>
      sublinks ? (
        sublinks.map(({link: sublinkLink, label: sublinkLabel}) => (
          <MobileMenuItem
            key={sublinkLabel}
            link={sublinkLink}
            label={sublinkLabel}
            {...{onClose, disabledText}}
          />
        ))
      ) : (
        <MobileMenuItem key={label} {...{label, link, onClose, disabledText}} />
      )
    )}
  </MenuList>
)
