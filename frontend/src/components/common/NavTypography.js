// @flow
import React from 'react'
import {Typography, withStyles} from '@material-ui/core'
import {ArrowDropDown} from '@material-ui/icons'

const StyledNavTypography = withStyles(({palette}) => ({
  root: {
    color: palette.text.secondary,
    fontSize: 14,
    fontWeight: 'bold',
    display: 'inline-flex',
    alignItems: 'center',
    textTransform: 'uppercase',
    position: 'relative',
    letterSpacing: 1,
  },
}))(Typography)

const NavTypography = ({
  children,
  className,
  hasArrow,
}: {
  children: any,
  className?: string,
  hasArrow?: boolean,
}) => {
  return (
    <StyledNavTypography className={className} variant="body1">
      {children}
      {hasArrow && <ArrowDropDown />}
    </StyledNavTypography>
  )
}

export default NavTypography
