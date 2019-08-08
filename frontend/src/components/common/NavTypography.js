// @flow
import React from 'react'
import {Typography, withStyles} from '@material-ui/core'

const StyledNavTypography = withStyles(({palette}) => ({
  root: {
    color: palette.text.secondary,
    fontSize: 14,
    fontWeight: 'bold',
    display: 'inline-block',
    textTransform: 'uppercase',
    position: 'relative',
    letterSpacing: 1,
  },
}))(Typography)

const NavTypography = ({children, className}: {children: any, className?: string}) => {
  return (
    <StyledNavTypography className={className} variant="body1">
      {children}
    </StyledNavTypography>
  )
}

export default NavTypography
