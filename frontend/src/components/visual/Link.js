import React from 'react'
import {Link as RouterLink} from 'react-router-dom'
import {Link as MuiLink} from '@material-ui/core'

const Link = ({to, children}) => (
  <MuiLink component={RouterLink} to={to}>
    {children}
  </MuiLink>
)

export default Link
