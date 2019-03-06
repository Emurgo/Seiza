import React from 'react'
import {Link as MuiLink} from '@material-ui/core'

const ExternalLink = ({to, children}) => {
  return <MuiLink href={to}>{children}</MuiLink>
}

export default ExternalLink
