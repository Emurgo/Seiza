import React from 'react'
import {Link as RouterLink} from 'react-router-dom'
import {Link as MuiLink} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles(({typography}) => ({
  monospace: typography._monospace,
}))

const Link = ({to, children, target = '_self', underline, monospace = false}) => {
  const classes = useStyles()
  return to ? (
    <MuiLink
      component={RouterLink}
      to={to}
      target={target}
      underline={underline}
      className={monospace ? classes.monospace : ''}
    >
      {children}
    </MuiLink>
  ) : (
    children
  )
}

export default Link
